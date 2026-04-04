<?php
/**
 * SIGNAL Game — Packet Validator
 *
 * Validates AI-generated content packets against schemas.
 */

defined( 'ABSPATH' ) || exit;

function signal_game_validate_packet( $packet_type, $content ) {
	switch ( $packet_type ) {
		case 'roomNarration':
			return signal_game_validate_room_narration( $content );
		case 'examineVariant':
			return signal_game_validate_examine_variant( $content );
		case 'npcDialogueVariant':
			return signal_game_validate_npc_dialogue( $content );
		case 'ambientEvent':
			return signal_game_validate_ambient_event( $content );
		default:
			return new WP_Error( 'unknown_type', "Unknown packet type: $packet_type" );
	}
}

function signal_game_validate_room_narration( $content ) {
	if ( empty( $content['description'] ) || ! is_string( $content['description'] ) ) {
		return new WP_Error( 'missing_description', 'roomNarration must have a description string' );
	}

	if ( strlen( $content['description'] ) > 2000 ) {
		return new WP_Error( 'description_too_long', 'Description exceeds 2000 characters' );
	}

	if ( strlen( $content['description'] ) < 20 ) {
		return new WP_Error( 'description_too_short', 'Description is too short to be useful' );
	}

	// Check for unclosed color markup.
	if ( preg_match_all( '/\{(\w+):/', $content['description'], $opens ) ) {
		$close_count = preg_match_all( '/\}/', $content['description'] );
		if ( count( $opens[0] ) > $close_count ) {
			return new WP_Error( 'broken_markup', 'Unclosed {color:text} markup tags' );
		}
	}

	// Validate color names if markup is used.
	$valid_colors = [ 'pink', 'cyan', 'green', 'purple', 'amber', 'red', 'dim', 'bright' ];
	if ( preg_match_all( '/\{(\w+):/', $content['description'], $colors ) ) {
		foreach ( $colors[1] as $color ) {
			if ( ! in_array( $color, $valid_colors, true ) ) {
				return new WP_Error( 'invalid_color', "Invalid color markup: {$color}" );
			}
		}
	}

	// interactableHints is optional but must be an array if present.
	if ( isset( $content['interactableHints'] ) && ! is_array( $content['interactableHints'] ) ) {
		return new WP_Error( 'invalid_hints', 'interactableHints must be an array' );
	}

	return true;
}

function signal_game_validate_examine_variant( $content ) {
	if ( empty( $content['targetKey'] ) || ! is_string( $content['targetKey'] ) ) {
		return new WP_Error( 'missing_target', 'examineVariant must have a targetKey' );
	}

	if ( empty( $content['text'] ) || ! is_string( $content['text'] ) ) {
		return new WP_Error( 'missing_text', 'examineVariant must have text' );
	}

	if ( strlen( $content['text'] ) > 1000 ) {
		return new WP_Error( 'text_too_long', 'Examine text exceeds 1000 characters' );
	}

	return true;
}

function signal_game_validate_npc_dialogue( $content ) {
	if ( empty( $content['npcId'] ) || ! is_string( $content['npcId'] ) ) {
		return new WP_Error( 'missing_npc', 'npcDialogueVariant must have npcId' );
	}

	if ( empty( $content['text'] ) || ! is_string( $content['text'] ) ) {
		return new WP_Error( 'missing_text', 'npcDialogueVariant must have text' );
	}

	if ( strlen( $content['text'] ) > 500 ) {
		return new WP_Error( 'text_too_long', 'NPC dialogue text exceeds 500 characters' );
	}

	return true;
}

function signal_game_validate_ambient_event( $content ) {
	if ( empty( $content['text'] ) || ! is_string( $content['text'] ) ) {
		return new WP_Error( 'missing_text', 'ambientEvent must have text' );
	}

	if ( strlen( $content['text'] ) > 500 ) {
		return new WP_Error( 'text_too_long', 'Ambient event text exceeds 500 characters' );
	}

	$valid_triggers = [ 'onEntry', 'onIdle', 'onExamine' ];
	if ( isset( $content['trigger'] ) && ! in_array( $content['trigger'], $valid_triggers, true ) ) {
		return new WP_Error( 'invalid_trigger', "Invalid trigger: {$content['trigger']}" );
	}

	return true;
}
