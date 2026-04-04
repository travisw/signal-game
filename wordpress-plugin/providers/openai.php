<?php
/**
 * SIGNAL Game — OpenAI Provider
 */

defined( 'ABSPATH' ) || exit;

function signal_game_provider_openai( $api_key, $model_override = '' ) {
	$model = $model_override ?: 'gpt-4o';

	return [
		'id'       => 'openai',
		'name'     => 'OpenAI',
		'generate' => function ( $params ) use ( $api_key, $model ) {
			$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', [
				'timeout' => 30,
				'headers' => [
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . $api_key,
				],
				'body' => wp_json_encode( [
					'model'       => $model,
					'max_tokens'  => $params['maxTokens'] ?? 500,
					'temperature' => $params['temperature'] ?? 0.7,
					'response_format' => [ 'type' => 'json_object' ],
					'messages'    => [
						[ 'role' => 'system', 'content' => $params['systemPrompt'] ],
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
					'openai_error',
					$body['error']['message'] ?? "HTTP $code"
				);
			}

			$text = $body['choices'][0]['message']['content'] ?? '';

			return [
				'text'  => $text,
				'usage' => [
					'inputTokens'  => $body['usage']['prompt_tokens'] ?? 0,
					'outputTokens' => $body['usage']['completion_tokens'] ?? 0,
				],
			];
		},
	];
}
