<?php
/**
 * SIGNAL Game — Anthropic Claude Provider
 */

defined( 'ABSPATH' ) || exit;

function signal_game_provider_claude( $api_key, $model_override = '' ) {
	$model = $model_override ?: 'claude-sonnet-4-20250514';

	return [
		'id'       => 'claude',
		'name'     => 'Anthropic Claude',
		'generate' => function ( $params ) use ( $api_key, $model ) {
			$response = wp_remote_post( 'https://api.anthropic.com/v1/messages', [
				'timeout' => 30,
				'headers' => [
					'Content-Type'      => 'application/json',
					'x-api-key'         => $api_key,
					'anthropic-version'  => '2023-06-01',
				],
				'body' => wp_json_encode( [
					'model'      => $model,
					'max_tokens' => $params['maxTokens'] ?? 500,
					'temperature' => $params['temperature'] ?? 0.7,
					'system'     => $params['systemPrompt'],
					'messages'   => [
						[ 'role' => 'user', 'content' => $params['userPrompt'] ],
					],
				] ),
			] );

			if ( is_wp_error( $response ) ) {
				return $response;
			}

			$code = wp_remote_retrieve_response_code( $response );
			$body = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( $code !== 200 ) {
				return new WP_Error(
					'claude_error',
					$body['error']['message'] ?? "HTTP $code"
				);
			}

			$text = $body['content'][0]['text'] ?? '';

			return [
				'text'  => $text,
				'usage' => [
					'inputTokens'  => $body['usage']['input_tokens'] ?? 0,
					'outputTokens' => $body['usage']['output_tokens'] ?? 0,
				],
			];
		},
	];
}
