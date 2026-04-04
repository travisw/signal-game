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
 * Serve the game full-screen on pages that contain the [signal_game] shortcode.
 *
 * This bypasses the theme entirely — no header, footer, sidebar, or admin bar.
 * The plugin serves its own complete HTML document, just like the standalone
 * game.html but with WordPress config injected.
 *
 * Works with any theme (classic or block) because the theme is never loaded.
 */
add_shortcode( 'signal_game', function () {
	// The shortcode itself returns nothing — the template_redirect hook
	// handles the full-page takeover before any theme output.
	return '';
} );

add_action( 'template_redirect', function () {
	if ( ! is_singular( 'page' ) ) {
		return;
	}

	$post = get_post();
	if ( ! $post || ! has_shortcode( $post->post_content, 'signal_game' ) ) {
		return;
	}

	// Serve the game template directly — bypasses the theme completely.
	include SIGNAL_GAME_DIR . 'templates/game.php';
	exit;
} );

// No wp_enqueue_scripts needed — the template serves its own complete HTML
// document with assets loaded directly. No theme involvement.
