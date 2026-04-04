<?php
/**
 * SIGNAL Game — Custom Endpoint Provider (OpenAI-compatible)
 */

defined( 'ABSPATH' ) || exit;

function signal_game_provider_custom( $api_key, $model_override = '', $endpoint = '' ) {
	if ( empty( $endpoint ) ) {
		return null;
	}

	$model = $model_override ?: 'default';

	return [
		'id'       => 'custom',
		'name'     => 'Custom Endpoint',
		'generate' => function ( $params ) use ( $api_key, $model, $endpoint ) {
			$headers = [
				'Content-Type' => 'application/json',
			];

			if ( ! empty( $api_key ) ) {
				$headers['Authorization'] = 'Bearer ' . $api_key;
			}

			$response = wp_remote_post( $endpoint, [
				'timeout' => 30,
				'headers' => $headers,
				'body'    => wp_json_encode( [
					'model'       => $model,
					'max_tokens'  => $params['maxTokens'] ?? 500,
					'temperature' => $params['temperature'] ?? 0.7,
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
					'custom_error',
					$body['error']['message'] ?? "HTTP $code"
				);
			}

			$text = $body['choices'][0]['message']['content'] ?? $body['content'][0]['text'] ?? '';

			return [
				'text'  => $text,
				'usage' => [
					'inputTokens'  => $body['usage']['prompt_tokens'] ?? $body['usage']['input_tokens'] ?? 0,
					'outputTokens' => $body['usage']['completion_tokens'] ?? $body['usage']['output_tokens'] ?? 0,
				],
			];
		},
	];
}
