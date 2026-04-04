<?php
/**
 * Plugin Name: SIGNAL Game
 * Description: A browser-based text adventure with synthwave terminal aesthetic and optional AI-generated content.
 * Version: 1.0.0
 * Author: Travis
 * License: MIT
 */

defined( 'ABSPATH' ) || exit;

define( 'SIGNAL_GAME_VERSION', '1.0.0' );
define( 'SIGNAL_GAME_DIR', plugin_dir_path( __FILE__ ) );
define( 'SIGNAL_GAME_URL', plugin_dir_url( __FILE__ ) );
define( 'SIGNAL_GAME_ENGINE_URL', plugin_dir_url( __FILE__ ) . '../engine/' );

// Load components.
require_once SIGNAL_GAME_DIR . 'admin-settings.php';
require_once SIGNAL_GAME_DIR . 'save-handler.php';
require_once SIGNAL_GAME_DIR . 'ai-gateway.php';

/**
 * Register the full-screen game page template.
 */
add_filter( 'theme_page_templates', function ( $templates ) {
	$templates['signal-game-template'] = 'SIGNAL Game (Full Screen)';
	return $templates;
} );

add_filter( 'template_include', function ( $template ) {
	if ( get_page_template_slug() === 'signal-game-template' ) {
		return SIGNAL_GAME_DIR . 'template.php';
	}
	return $template;
} );

/**
 * Enqueue game assets on the game template page.
 */
add_action( 'wp_enqueue_scripts', function () {
	if ( get_page_template_slug() !== 'signal-game-template' ) {
		return;
	}

	$engine_url = SIGNAL_GAME_ENGINE_URL;

	wp_enqueue_style(
		'signal-game-fonts',
		'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap',
		[],
		null
	);

	wp_enqueue_style(
		'signal-game-terminal',
		$engine_url . 'css/terminal.css',
		[ 'signal-game-fonts' ],
		SIGNAL_GAME_VERSION
	);

	wp_enqueue_script(
		'signal-game-main',
		$engine_url . 'src/main.js',
		[],
		SIGNAL_GAME_VERSION,
		[ 'strategy' => 'defer', 'in_footer' => true ]
	);

	// Pass config to the game.
	$settings  = get_option( 'signal_game_settings', [] );
	$ai_enabled = ! empty( $settings['ai_enabled'] ) && ! empty( $settings['ai_provider'] ) && ! empty( $settings['ai_api_key'] );

	$config = [
		'apiBase' => rest_url( 'signal-game/v1' ),
		'nonce'   => wp_create_nonce( 'wp_rest' ),
		'ai'      => [
			'enabled' => $ai_enabled,
		],
		'settings' => [
			'gameTitle'    => $settings['game_title'] ?? 'SIGNAL',
			'startSector'  => $settings['start_sector'] ?? '',
			'difficulty'   => $settings['difficulty'] ?? 'normal',
			'welcomeText'  => $settings['welcome_text'] ?? '',
		],
	];

	wp_add_inline_script(
		'signal-game-main',
		'window.wpSignalGame = ' . wp_json_encode( $config ) . ';',
		'before'
	);
} );

/**
 * Add the ES module type attribute to the game script.
 */
add_filter( 'script_loader_tag', function ( $tag, $handle ) {
	if ( $handle === 'signal-game-main' ) {
		$tag = str_replace( ' src', ' type="module" src', $tag );
	}
	return $tag;
}, 10, 2 );
