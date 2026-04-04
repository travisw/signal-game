<?php
/**
 * Plugin Name:       SIGNAL Game
 * Plugin URI:        https://github.com/travisw/signal-game
 * Description:       A browser-based text adventure with synthwave terminal aesthetic and optional AI-generated content.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Travis
 * Author URI:        https://github.com/travisw
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       signal-game
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SIGNAL_GAME_VERSION', '1.0.0' );
define( 'SIGNAL_GAME_DIR', plugin_dir_path( __FILE__ ) );
define( 'SIGNAL_GAME_URL', plugin_dir_url( __FILE__ ) );

// Load components.
require_once SIGNAL_GAME_DIR . 'includes/admin-settings.php';
require_once SIGNAL_GAME_DIR . 'includes/save-handler.php';
require_once SIGNAL_GAME_DIR . 'includes/ai-gateway.php';

/**
 * Register the full-screen game page template.
 *
 * The theme_page_templates filter makes it appear in the editor dropdown.
 * The template_include filter resolves the file path at render time.
 */
add_filter( 'theme_page_templates', function ( $templates, $theme, $post ) {
	$templates['signal-game-template'] = 'SIGNAL Game (Full Screen)';
	return $templates;
}, 10, 3 );

add_filter( 'template_include', function ( $template ) {
	if ( get_page_template_slug() === 'signal-game-template' ) {
		return SIGNAL_GAME_DIR . 'templates/game.php';
	}
	return $template;
} );

/**
 * For block themes: also register via the page_template_hierarchy filter
 * so the template is discoverable in the block editor's template system.
 */
add_filter( 'page_template_hierarchy', function ( $templates ) {
	if ( get_page_template_slug() === 'signal-game-template' ) {
		array_unshift( $templates, SIGNAL_GAME_DIR . 'templates/game.php' );
	}
	return $templates;
} );

/**
 * Register a shortcode as an alternative way to embed the game.
 * Usage: create any page and add [signal_game] to the content.
 */
add_shortcode( 'signal_game', function () {
	// Enqueue assets if not already done.
	if ( ! wp_script_is( 'signal-game-main', 'enqueued' ) && ! wp_script_is( 'signal-game-main', 'registered' ) ) {
		signal_game_enqueue_assets();
	}

	ob_start();
	?>
	<div id="game-container" class="game-container" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;">
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
	<?php
	return ob_get_clean();
} );

/**
 * Enqueue game assets. Called on template pages and by the shortcode.
 */
function signal_game_enqueue_assets() {
	$assets_url = SIGNAL_GAME_URL . 'assets/';

	wp_enqueue_style(
		'signal-game-fonts',
		'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap',
		[],
		null
	);

	wp_enqueue_style(
		'signal-game-terminal',
		$assets_url . 'css/terminal.css',
		[ 'signal-game-fonts' ],
		SIGNAL_GAME_VERSION
	);

	// Use wp_enqueue_script_module if available (WP 6.5+), otherwise fallback.
	if ( function_exists( 'wp_enqueue_script_module' ) ) {
		wp_enqueue_script_module(
			'signal-game-main',
			$assets_url . 'js/main.js',
			[],
			SIGNAL_GAME_VERSION
		);
	} else {
		wp_enqueue_script(
			'signal-game-main',
			$assets_url . 'js/main.js',
			[],
			SIGNAL_GAME_VERSION,
			[ 'strategy' => 'defer', 'in_footer' => true ]
		);

		add_filter( 'script_loader_tag', function ( $tag, $handle ) {
			if ( $handle === 'signal-game-main' ) {
				$tag = str_replace( '<script ', '<script type="module" ', $tag );
			}
			return $tag;
		}, 10, 2 );
	}

	// Pass config to the game.
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

	wp_add_inline_script(
		'signal-game-main',
		'window.wpSignalGame = ' . wp_json_encode( $config ) . ';',
		'before'
	);
}

/**
 * Auto-enqueue on game template pages.
 */
add_action( 'wp_enqueue_scripts', function () {
	$is_game_template = get_page_template_slug() === 'signal-game-template';
	$has_shortcode     = is_singular() && has_shortcode( get_post()->post_content ?? '', 'signal_game' );

	if ( $is_game_template || $has_shortcode ) {
		signal_game_enqueue_assets();
	}
} );
