<?php
/**
 * SIGNAL Game — Save/Load REST API
 *
 * Stores game saves in WordPress user meta.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'rest_api_init', function () {
	$namespace = 'signal-game/v1';

	register_rest_route( $namespace, '/save', [
		'methods'             => 'POST',
		'callback'            => 'signal_game_save',
		'permission_callback' => 'is_user_logged_in',
	] );

	register_rest_route( $namespace, '/load', [
		'methods'             => 'GET',
		'callback'            => 'signal_game_load',
		'permission_callback' => 'is_user_logged_in',
	] );

	register_rest_route( $namespace, '/saves', [
		'methods'             => 'GET',
		'callback'            => 'signal_game_list_saves',
		'permission_callback' => 'is_user_logged_in',
	] );

	register_rest_route( $namespace, '/save', [
		'methods'             => 'DELETE',
		'callback'            => 'signal_game_delete_save',
		'permission_callback' => 'is_user_logged_in',
	] );
} );

function signal_game_save( WP_REST_Request $request ) {
	$user_id = get_current_user_id();
	$slot    = sanitize_text_field( $request->get_param( 'slot' ) ?? 'auto' );
	$data    = $request->get_json_params()['data'] ?? null;

	if ( ! $data ) {
		return new WP_Error( 'missing_data', 'No save data provided.', [ 'status' => 400 ] );
	}

	$saves = get_user_meta( $user_id, 'signal_game_saves', true ) ?: [];
	$saves[ $slot ] = [
		'data'    => $data,
		'savedAt' => gmdate( 'c' ),
	];

	update_user_meta( $user_id, 'signal_game_saves', $saves );

	return [ 'success' => true, 'slot' => $slot ];
}

function signal_game_load( WP_REST_Request $request ) {
	$user_id = get_current_user_id();
	$slot    = sanitize_text_field( $request->get_param( 'slot' ) ?? 'auto' );
	$saves   = get_user_meta( $user_id, 'signal_game_saves', true ) ?: [];

	if ( ! isset( $saves[ $slot ] ) ) {
		return new WP_Error( 'not_found', 'No save in that slot.', [ 'status' => 404 ] );
	}

	return [ 'data' => $saves[ $slot ]['data'], 'savedAt' => $saves[ $slot ]['savedAt'] ];
}

function signal_game_list_saves( WP_REST_Request $request ) {
	$user_id = get_current_user_id();
	$saves   = get_user_meta( $user_id, 'signal_game_saves', true ) ?: [];

	$list = [];
	foreach ( $saves as $slot => $save ) {
		$list[] = [ 'slot' => $slot, 'savedAt' => $save['savedAt'] ];
	}

	return $list;
}

function signal_game_delete_save( WP_REST_Request $request ) {
	$user_id = get_current_user_id();
	$slot    = sanitize_text_field( $request->get_param( 'slot' ) ?? '' );
	$saves   = get_user_meta( $user_id, 'signal_game_saves', true ) ?: [];

	unset( $saves[ $slot ] );
	update_user_meta( $user_id, 'signal_game_saves', $saves );

	return [ 'success' => true ];
}
