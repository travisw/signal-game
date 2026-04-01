/**
 * SIGNAL — Main Entry Point
 *
 * Bootstraps the game: initializes renderer and game engine,
 * wires up input, and starts the game.
 */

import { Renderer } from './renderer.js';
import { Game } from './game.js';

// Initialize
const renderer = new Renderer();
const game = new Game(renderer);

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
