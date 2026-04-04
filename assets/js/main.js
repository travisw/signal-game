/**
 * SIGNAL — Main Entry Point
 *
 * Bootstraps the game: initializes renderer, AI content service,
 * and game engine. Wires up input and starts the game.
 */

import { Renderer } from './renderer.js';
import { Game } from './game.js';
import { AIContentService } from './ai-content.js';

// Initialize renderer
const renderer = new Renderer();

// Initialize AI content service (enabled only when WordPress provides config)
const wpConfig = window.wpSignalGame;
const aiService = new AIContentService({
  enabled: wpConfig?.ai?.enabled || false,
  endpoint: wpConfig?.apiBase || null,
  nonce: wpConfig?.nonce || null,
});

// Determine base URL for loading game data.
// In WordPress: passed via wpSignalGame.assetsURL
// Standalone: relative to the HTML file (assets/ is sibling)
const baseURL = wpConfig?.assetsURL || '';

// Initialize game
const game = new Game(renderer, aiService, baseURL);

// Wire up command input
renderer.onCommand(async (input) => {
  renderer.setInputEnabled(false);
  try {
    await game.handleCommand(input);
  } catch (e) {
    console.error('Command error:', e);
    renderer.printLine(`{pink:Error: ${e.message}}`);
  }
  renderer.setInputEnabled(true);
});

// Start
game.start();
