<?php
/**
 * SIGNAL Game — AI Content Gateway
 *
 * REST endpoint that generates AI content packets server-side.
 * Handles prompt assembly, provider dispatch, validation, and caching.
 */

defined( 'ABSPATH' ) || exit;

require_once SIGNAL_GAME_DIR . 'includes/providers/claude.php';
require_once SIGNAL_GAME_DIR . 'includes/providers/openai.php';
require_once SIGNAL_GAME_DIR . 'includes/providers/custom.php';
require_once SIGNAL_GAME_DIR . 'includes/prompt-builder.php';
require_once SIGNAL_GAME_DIR . 'includes/packet-validator.php';

add_action( 'rest_api_init', function () {
	register_rest_route( 'signal-game/v1', '/ai/generate', [
		'methods'             => 'POST',
		'callback'            => 'signal_game_ai_generate',
		'permission_callback' => '__return_true', // Public — game may be played without login.
	] );
} );

function signal_game_ai_generate( WP_REST_Request $request ) {
	$settings = get_option( 'signal_game_settings', [] );

	// Check if AI is enabled.
	if ( empty( $settings['ai_enabled'] ) || empty( $settings['ai_provider'] ) || empty( $settings['ai_api_key'] ) ) {
		return new WP_REST_Response( [
			'packetType' => $request->get_param( 'packetType' ),
			'content'    => null,
			'fallback'   => true,
			'error'      => 'ai_disabled',
		], 200 );
	}

	$packet_type = sanitize_text_field( $request->get_param( 'packetType' ) ?? '' );
	$context     = $request->get_json_params()['context'] ?? [];

	// Validate packet type.
	$allowed_types = [ 'roomNarration', 'examineVariant', 'npcDialogueVariant', 'ambientEvent', 'sideObjective' ];
	if ( ! in_array( $packet_type, $allowed_types, true ) ) {
		return new WP_REST_Response( [
			'packetType' => $packet_type,
			'content'    => null,
			'fallback'   => true,
			'error'      => 'invalid_packet_type',
		], 200 );
	}

	// Rate limiting (per-IP, simple transient-based).
	$rate_limit = intval( $settings['ai_rate_limit'] ?? 10 );
	$ip_hash    = md5( $_SERVER['REMOTE_ADDR'] ?? 'unknown' );
	$rate_key   = 'signal_ai_rate_' . $ip_hash;
	$requests   = intval( get_transient( $rate_key ) ?: 0 );

	if ( $requests >= $rate_limit ) {
		return new WP_REST_Response( [
			'packetType' => $packet_type,
			'content'    => null,
			'fallback'   => true,
			'error'      => 'rate_limited',
		], 200 );
	}

	set_transient( $rate_key, $requests + 1, MINUTE_IN_SECONDS );

	// Check cache.
	$cache_key   = signal_game_cache_key( $packet_type, $context );
	$cached      = get_transient( 'signal_ai_' . $cache_key );
	if ( $cached !== false ) {
		return new WP_REST_Response( [
			'packetType' => $packet_type,
			'content'    => $cached,
			'meta'       => [ 'cached' => true, 'cacheKey' => $cache_key ],
		], 200 );
	}

	// Build prompt.
	$prompt = signal_game_build_prompt( $packet_type, $context );

	// Get provider adapter.
	$provider = signal_game_get_provider( $settings );
	if ( ! $provider ) {
		return new WP_REST_Response( [
			'packetType' => $packet_type,
			'content'    => null,
			'fallback'   => true,
			'error'      => 'provider_not_configured',
		], 200 );
	}

	// Generate.
	$start_time = microtime( true );
	$result     = $provider['generate']( [
		'systemPrompt' => $prompt['system'],
		'userPrompt'   => $prompt['user'],
		'maxTokens'    => 500,
		'temperature'  => floatval( $settings['ai_temperature'] ?? 0.7 ),
	] );

	if ( is_wp_error( $result ) ) {
		return new WP_REST_Response( [
			'packetType' => $packet_type,
			'content'    => null,
			'fallback'   => true,
			'error'      => $result->get_error_message(),
		], 200 );
	}

	$generation_ms = round( ( microtime( true ) - $start_time ) * 1000 );

	// Parse JSON from response.
	$content = json_decode( $result['text'], true );
	if ( ! $content ) {
		// Try extracting JSON from markdown code block.
		if ( preg_match( '/```json\s*(.*?)\s*```/s', $result['text'], $matches ) ) {
			$content = json_decode( $matches[1], true );
		}
	}

	if ( ! $content ) {
		return new WP_REST_Response( [
			'packetType' => $packet_type,
			'content'    => null,
			'fallback'   => true,
			'error'      => 'invalid_json_response',
		], 200 );
	}

	// Validate packet schema.
	$validation = signal_game_validate_packet( $packet_type, $content );
	if ( is_wp_error( $validation ) ) {
		return new WP_REST_Response( [
			'packetType' => $packet_type,
			'content'    => null,
			'fallback'   => true,
			'error'      => 'validation_failed: ' . $validation->get_error_message(),
		], 200 );
	}

	// Cache for 1 hour.
	set_transient( 'signal_ai_' . $cache_key, $content, HOUR_IN_SECONDS );

	// Track usage.
	$usage_today = intval( get_transient( 'signal_ai_usage_today' ) ?: 0 );
	set_transient( 'signal_ai_usage_today', $usage_today + 1, DAY_IN_SECONDS );

	return new WP_REST_Response( [
		'packetType' => $packet_type,
		'content'    => $content,
		'meta'       => [
			'cached'       => false,
			'cacheKey'     => $cache_key,
			'generationMs' => $generation_ms,
		],
	], 200 );
}

function signal_game_cache_key( $packet_type, $context ) {
	$parts = [
		$packet_type,
		$context['sectorId'] ?? '',
		$context['roomId'] ?? '',
		'v' . ( $context['visitCount'] ?? 0 ),
		'd' . ( $context['day'] ?? 0 ),
		'h' . ( intval( $context['playerHp'] ?? 100 ) > 50 ? 'hi' : 'lo' ),
	];
	return md5( implode( ':', $parts ) );
}

function signal_game_get_provider( $settings ) {
	$provider_id = $settings['ai_provider'] ?? '';
	$api_key     = $settings['ai_api_key'] ?? '';
	$model       = $settings['ai_model'] ?? '';

	switch ( $provider_id ) {
		case 'claude':
			return signal_game_provider_claude( $api_key, $model );
		case 'openai':
			return signal_game_provider_openai( $api_key, $model );
		case 'custom':
			$endpoint = $settings['ai_custom_endpoint'] ?? '';
			return signal_game_provider_custom( $api_key, $model, $endpoint );
		default:
			return null;
	}
}
