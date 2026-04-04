<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?php wp_title( '|', true, 'right' ); ?> SIGNAL</title>
	<?php wp_head(); ?>
</head>
<body class="signal-game-fullscreen">
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

	<?php wp_footer(); ?>
</body>
</html>
