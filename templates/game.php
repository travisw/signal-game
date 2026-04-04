<?php
/**
 * SIGNAL Game — Full-Screen Template
 *
 * Serves a complete HTML document with no theme involvement.
 * Loads game assets directly. Used by the [signal_game] shortcode
 * via template_redirect.
 */

defined( 'ABSPATH' ) || exit;

$assets_url = SIGNAL_GAME_URL . 'assets/';
$settings   = get_option( 'signal_game_settings', [] );
$ai_enabled = ! empty( $settings['ai_enabled'] ) && ! empty( $settings['ai_provider'] ) && ! empty( $settings['ai_api_key'] );

$config = [
	'apiBase'   => rest_url( 'signal-game/v1' ),
	'nonce'     => wp_create_nonce( 'wp_rest' ),
	'assetsURL' => $assets_url,
	'ai'        => [
		'enabled' => $ai_enabled,
	],
	'settings'  => [
		'gameTitle'   => $settings['game_title'] ?? 'SIGNAL',
		'startSector' => $settings['start_sector'] ?? '',
		'difficulty'  => $settings['difficulty'] ?? 'normal',
		'welcomeText' => $settings['welcome_text'] ?? '',
	],
];
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?php echo esc_html( $settings['game_title'] ?? 'SIGNAL' ); ?></title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="<?php echo esc_url( $assets_url . 'css/terminal.css' ); ?>">
	<script>window.wpSignalGame = <?php echo wp_json_encode( $config ); ?>;</script>
</head>
<body>
	<div id="game-container" class="game-container">
		<div class="scanlines"></div>

		<div id="top-bar" class="top-bar">
			<span class="game-title">S I G N A L</span>
			<span id="location-display" class="location"></span>
			<span id="time-display" class="time-display"></span>
		</div>

		<div class="main">
			<div id="narrative" class="narrative"></div>
			<div id="sidebar" class="sidebar"></div>
		</div>

		<div id="input-bar" class="input-bar">
			<span class="prompt-char">❯ </span>
			<input type="text" id="command-input" class="command-input" autofocus autocomplete="off" spellcheck="false">
		</div>
	</div>

	<script type="module" src="<?php echo esc_url( $assets_url . 'js/main.js' ); ?>"></script>
</body>
</html>
