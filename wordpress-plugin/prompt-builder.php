<?php
/**
 * SIGNAL Game — Prompt Builder
 *
 * Assembles the 4-layer prompt for AI content generation.
 */

defined( 'ABSPATH' ) || exit;

function signal_game_build_prompt( $packet_type, $context ) {
	$system = signal_game_system_rules();
	$user   = signal_game_packet_prompt( $packet_type, $context );

	return [
		'system' => $system,
		'user'   => $user,
	];
}

function signal_game_system_rules() {
	return <<<'PROMPT'
You are a content writer for SIGNAL, a cyberpunk post-apocalyptic text adventure game played in a terminal interface. You generate bounded content packets as JSON — never freeform conversation. You are not a chatbot. You are a constrained encounter writer.

SETTING: The year is 2126. A rogue AI called ATLAS collapsed civilization 40 years ago. The player wakes from cryo with no memory, following a mysterious signal to ATLAS's underground core. The world is ruins, scavengers, and dead technology slowly coming back to life.

WRITING RULES:
- 2-4 sentences for standard rooms, up to 6 for key story moments
- At least one non-visual sensory detail (sound, smell, touch, temperature)
- Short sentences for tension. Longer for wonder. Match rhythm to mood.
- Never use "you see" — use active, immersive constructions
- Highlight interactable objects distinctly in prose
- Maintain mystery: answer one small question while raising another
- Use {color:text} markup for color: cyan=interactable, amber=items, purple=NPC/implant, pink=danger, green=safety, dim=flavor, bright=emphasis
- Never reference mechanics the parser cannot support
- Never generate room exits, item IDs, flag names, or stat changes
- Never break the terminal fiction — write as if the text IS the terminal output
- Prefer one sharp evocative detail over multiple generic adjectives
- Keep NPC speech to 1-3 short beats before returning agency to the player
- Failure text should still be interesting and world-revealing, not a dead end

TONE: Dark, atmospheric, occasionally wry. The world is broken but not hopeless. Beauty exists in decay. Technology is both salvation and curse. Think Cormac McCarthy meets William Gibson.

OUTPUT: Always return valid JSON matching the requested schema. No markdown wrapping, no commentary outside the JSON.
PROMPT;
}

function signal_game_packet_prompt( $packet_type, $context ) {
	switch ( $packet_type ) {
		case 'roomNarration':
			return signal_game_prompt_room_narration( $context );
		case 'examineVariant':
			return signal_game_prompt_examine_variant( $context );
		case 'npcDialogueVariant':
			return signal_game_prompt_npc_dialogue( $context );
		case 'ambientEvent':
			return signal_game_prompt_ambient_event( $context );
		default:
			return signal_game_prompt_room_narration( $context );
	}
}

function signal_game_prompt_room_narration( $context ) {
	$sector      = $context['sectorId'] ?? 'unknown';
	$room        = $context['roomId'] ?? 'unknown';
	$room_name   = $context['roomName'] ?? 'Unknown Room';
	$static_desc = $context['staticDescription'] ?? '';
	$time        = $context['timeOfDay'] ?? 'day';
	$day         = $context['day'] ?? 1;
	$skills      = json_encode( $context['playerSkills'] ?? [] );
	$hp          = $context['playerHp'] ?? 100;
	$rad         = $context['playerRad'] ?? 0;
	$visit       = $context['visitCount'] ?? 1;
	$memories    = implode( ', ', $context['memoriesFound'] ?? [] );
	$events      = implode( '; ', $context['recentEvents'] ?? [] );

	$visit_note = $visit <= 1
		? 'This is the player\'s first visit to this room.'
		: "The player has visited this room $visit times before. Vary the description — notice different details, reflect changes.";

	return <<<PROMPT
Generate a roomNarration packet for this room.

ROOM: {$room_name} (sector: {$sector}, room: {$room})
TIME: {$time}, Day {$day}
VISIT: {$visit_note}
PLAYER STATE: HP {$hp}/100, RAD {$rad}/100, Skills: {$skills}
RECENT MEMORIES: {$memories}
RECENT EVENTS: {$events}

REFERENCE DESCRIPTION (the static version — capture its intent but write a fresh variant):
{$static_desc}

Return JSON:
{
  "description": "string — 2-6 sentences of room description text using {color:text} markup",
  "sensoryDetail": "string — 1 sentence, a non-visual sensory detail (sound, smell, touch)",
  "interactableHints": ["array", "of", "key", "nouns", "the", "player", "can", "interact", "with"]
}

QUALITY CHECK before responding:
1. Is every sentence earning its place?
2. Does it contain a non-visual sensory detail?
3. Are interactable objects signaled without being listed mechanically?
4. Does it make the player want to explore further?
5. Is the tone dark and atmospheric but not purple?
PROMPT;
}

function signal_game_prompt_examine_variant( $context ) {
	$target   = $context['targetKey'] ?? 'unknown';
	$static   = $context['staticText'] ?? '';
	$room     = $context['roomName'] ?? '';

	return <<<PROMPT
Generate an examineVariant packet.

EXAMINING: "{$target}" in {$room}
REFERENCE TEXT: {$static}

Return JSON:
{
  "targetKey": "{$target}",
  "text": "string — 1-3 sentences, a fresh variant of the examine text",
  "revealsDetail": false
}
PROMPT;
}

function signal_game_prompt_npc_dialogue( $context ) {
	$npc_id   = $context['npcId'] ?? 'unknown';
	$npc_name = $context['npcName'] ?? 'Unknown';
	$node_id  = $context['nodeId'] ?? 'start';
	$static   = $context['staticText'] ?? '';
	$tone     = $context['npcTone'] ?? 'neutral';

	return <<<PROMPT
Generate an npcDialogueVariant packet.

NPC: {$npc_name} (id: {$npc_id}), dialogue node: {$node_id}
NPC VOICE: {$tone}
REFERENCE LINE: {$static}

Return JSON:
{
  "npcId": "{$npc_id}",
  "nodeId": "{$node_id}",
  "text": "string — 1-3 sentences, same intent as reference but fresh wording",
  "tone": "{$tone}"
}
PROMPT;
}

function signal_game_prompt_ambient_event( $context ) {
	$sector = $context['sectorId'] ?? 'unknown';
	$room   = $context['roomId'] ?? 'unknown';
	$time   = $context['timeOfDay'] ?? 'day';

	return <<<PROMPT
Generate an ambientEvent packet — atmospheric flavor text for this location.

LOCATION: {$sector} / {$room}
TIME: {$time}

Return JSON:
{
  "text": "string — 1-2 sentences of atmospheric flavor",
  "trigger": "onEntry",
  "ephemeral": true
}
PROMPT;
}
