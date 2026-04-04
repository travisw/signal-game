<?php
/**
 * SIGNAL Game — Admin Settings Page
 *
 * Game configuration and AI provider settings.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'admin_menu', function () {
	add_options_page(
		'SIGNAL Game Settings',
		'SIGNAL Game',
		'manage_options',
		'signal-game',
		'signal_game_settings_page'
	);
} );

add_action( 'admin_init', function () {
	register_setting( 'signal_game', 'signal_game_settings', [
		'sanitize_callback' => 'signal_game_sanitize_settings',
	] );

	// Game settings section.
	add_settings_section( 'signal_game_general', 'Game Settings', null, 'signal-game' );

	add_settings_field( 'game_title', 'Game Title', function () {
		$settings = get_option( 'signal_game_settings', [] );
		printf(
			'<input type="text" name="signal_game_settings[game_title]" value="%s" class="regular-text">',
			esc_attr( $settings['game_title'] ?? 'SIGNAL' )
		);
	}, 'signal-game', 'signal_game_general' );

	add_settings_field( 'start_sector', 'Starting Sector', function () {
		$settings = get_option( 'signal_game_settings', [] );
		$current  = $settings['start_sector'] ?? '';
		printf(
			'<input type="text" name="signal_game_settings[start_sector]" value="%s" class="regular-text" placeholder="Leave blank for default (cryo-lab)">',
			esc_attr( $current )
		);
	}, 'signal-game', 'signal_game_general' );

	add_settings_field( 'difficulty', 'Difficulty', function () {
		$settings = get_option( 'signal_game_settings', [] );
		$current  = $settings['difficulty'] ?? 'normal';
		$options  = [ 'easy' => 'Easy', 'normal' => 'Normal', 'hard' => 'Hard' ];
		echo '<select name="signal_game_settings[difficulty]">';
		foreach ( $options as $value => $label ) {
			printf( '<option value="%s" %s>%s</option>', esc_attr( $value ), selected( $current, $value, false ), esc_html( $label ) );
		}
		echo '</select>';
	}, 'signal-game', 'signal_game_general' );

	add_settings_field( 'welcome_text', 'Custom Welcome Text', function () {
		$settings = get_option( 'signal_game_settings', [] );
		printf(
			'<textarea name="signal_game_settings[welcome_text]" rows="3" class="large-text">%s</textarea>
			<p class="description">Shown during the boot sequence. Leave blank for default.</p>',
			esc_textarea( $settings['welcome_text'] ?? '' )
		);
	}, 'signal-game', 'signal_game_general' );

	// AI settings section.
	add_settings_section( 'signal_game_ai', 'AI Content Generation', function () {
		echo '<p>Enable AI-generated content to add variety to room descriptions, NPC dialogue, and ambient events. Requires an API key from your chosen provider.</p>';
	}, 'signal-game' );

	add_settings_field( 'ai_enabled', 'Enable AI Content', function () {
		$settings = get_option( 'signal_game_settings', [] );
		printf(
			'<label><input type="checkbox" name="signal_game_settings[ai_enabled]" value="1" %s> Generate AI content for room descriptions and NPC dialogue</label>',
			checked( ! empty( $settings['ai_enabled'] ), true, false )
		);
	}, 'signal-game', 'signal_game_ai' );

	add_settings_field( 'ai_provider', 'AI Provider', function () {
		$settings = get_option( 'signal_game_settings', [] );
		$current  = $settings['ai_provider'] ?? '';
		$providers = [
			''       => '— Select —',
			'claude' => 'Anthropic Claude',
			'openai' => 'OpenAI',
			'custom' => 'Custom Endpoint',
		];
		echo '<select name="signal_game_settings[ai_provider]" id="signal-ai-provider">';
		foreach ( $providers as $value => $label ) {
			printf( '<option value="%s" %s>%s</option>', esc_attr( $value ), selected( $current, $value, false ), esc_html( $label ) );
		}
		echo '</select>';
	}, 'signal-game', 'signal_game_ai' );

	add_settings_field( 'ai_api_key', 'API Key', function () {
		$settings = get_option( 'signal_game_settings', [] );
		$has_key  = ! empty( $settings['ai_api_key'] );
		printf(
			'<input type="password" name="signal_game_settings[ai_api_key]" value="%s" class="regular-text" placeholder="%s">',
			$has_key ? '••••••••' : '',
			'Enter your provider API key'
		);
		if ( $has_key ) {
			echo '<p class="description">Key is saved. Enter a new value to change it, or leave as-is.</p>';
		}
	}, 'signal-game', 'signal_game_ai' );

	add_settings_field( 'ai_custom_endpoint', 'Custom Endpoint URL', function () {
		$settings = get_option( 'signal_game_settings', [] );
		printf(
			'<input type="url" name="signal_game_settings[ai_custom_endpoint]" value="%s" class="regular-text" placeholder="https://your-server.com/v1/chat/completions">
			<p class="description">For custom provider only. Must be OpenAI-compatible.</p>',
			esc_attr( $settings['ai_custom_endpoint'] ?? '' )
		);
	}, 'signal-game', 'signal_game_ai' );

	add_settings_field( 'ai_model', 'Model Override', function () {
		$settings = get_option( 'signal_game_settings', [] );
		printf(
			'<input type="text" name="signal_game_settings[ai_model]" value="%s" class="regular-text" placeholder="Leave blank for default">',
			esc_attr( $settings['ai_model'] ?? '' )
		);
	}, 'signal-game', 'signal_game_ai' );

	add_settings_field( 'ai_temperature', 'Temperature', function () {
		$settings = get_option( 'signal_game_settings', [] );
		printf(
			'<input type="number" name="signal_game_settings[ai_temperature]" value="%s" min="0" max="1" step="0.1" style="width:80px"> <span class="description">0.0 = deterministic, 1.0 = creative. Default: 0.7</span>',
			esc_attr( $settings['ai_temperature'] ?? '0.7' )
		);
	}, 'signal-game', 'signal_game_ai' );

	add_settings_field( 'ai_rate_limit', 'Rate Limit', function () {
		$settings = get_option( 'signal_game_settings', [] );
		printf(
			'<input type="number" name="signal_game_settings[ai_rate_limit]" value="%s" min="1" max="60" style="width:80px"> <span class="description">requests per minute per session. Default: 10</span>',
			esc_attr( $settings['ai_rate_limit'] ?? '10' )
		);
	}, 'signal-game', 'signal_game_ai' );
} );

function signal_game_sanitize_settings( $input ) {
	$old      = get_option( 'signal_game_settings', [] );
	$sanitized = [];

	$sanitized['game_title']    = sanitize_text_field( $input['game_title'] ?? 'SIGNAL' );
	$sanitized['start_sector']  = sanitize_text_field( $input['start_sector'] ?? '' );
	$sanitized['difficulty']    = in_array( $input['difficulty'] ?? '', [ 'easy', 'normal', 'hard' ], true ) ? $input['difficulty'] : 'normal';
	$sanitized['welcome_text']  = sanitize_textarea_field( $input['welcome_text'] ?? '' );
	$sanitized['ai_enabled']    = ! empty( $input['ai_enabled'] );
	$sanitized['ai_provider']   = in_array( $input['ai_provider'] ?? '', [ 'claude', 'openai', 'custom' ], true ) ? $input['ai_provider'] : '';
	$sanitized['ai_temperature'] = max( 0, min( 1, floatval( $input['ai_temperature'] ?? 0.7 ) ) );
	$sanitized['ai_rate_limit'] = max( 1, min( 60, intval( $input['ai_rate_limit'] ?? 10 ) ) );
	$sanitized['ai_custom_endpoint'] = esc_url_raw( $input['ai_custom_endpoint'] ?? '' );
	$sanitized['ai_model']      = sanitize_text_field( $input['ai_model'] ?? '' );

	// Only update API key if a real value was entered (not the masked placeholder).
	if ( ! empty( $input['ai_api_key'] ) && $input['ai_api_key'] !== '••••••••' ) {
		$sanitized['ai_api_key'] = sanitize_text_field( $input['ai_api_key'] );
	} else {
		$sanitized['ai_api_key'] = $old['ai_api_key'] ?? '';
	}

	return $sanitized;
}

function signal_game_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1>SIGNAL Game Settings</h1>
		<form method="post" action="options.php">
			<?php
			settings_fields( 'signal_game' );
			do_settings_sections( 'signal-game' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}
