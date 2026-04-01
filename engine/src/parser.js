/**
 * SIGNAL — Command Parser
 *
 * Handles input parsing, aliases, and command normalization.
 * The Game class handles actual command dispatch — this module
 * just cleans up and normalizes input.
 */

export class Parser {
  constructor() {
    // Command aliases
    this.aliases = {
      'i': 'inventory',
      'inv': 'inventory',
      'l': 'look',
      'x': 'examine',
      'h': 'help',
      '?': 'help',
      'm': 'map',
      'n': 'go north',
      's': 'go south',
      'e': 'go east',
      'w': 'go west',
      'u': 'go up',
      'd': 'go down',
      'get': 'take',
      'pick up': 'take',
      'grab': 'take',
      'speak': 'talk',
      'chat': 'talk',
      'stats': 'status',
      'check': 'look',
    };
  }

  /**
   * Parse raw input into a normalized command string.
   * Returns { verb, args, raw }
   */
  parse(input) {
    let raw = input.trim().toLowerCase();

    // Check for numbered choice first
    const num = parseInt(raw);
    if (!isNaN(num) && raw === String(num)) {
      return { verb: '__choice', args: num, raw };
    }

    // Apply aliases
    for (const [alias, replacement] of Object.entries(this.aliases)) {
      if (raw === alias || raw.startsWith(alias + ' ')) {
        raw = raw.replace(alias, replacement);
        break;
      }
    }

    // Split into verb and args
    const parts = raw.split(/\s+/);
    const verb = parts[0];
    const args = parts.slice(1).join(' ');

    // Clean up common prepositions
    const cleanArgs = args
      .replace(/^(at|the|a|an)\s+/i, '')
      .replace(/\s+(the|a|an)\s+/g, ' ')
      .trim();

    return { verb, args: cleanArgs, raw };
  }

  /**
   * Get autocomplete suggestions for partial input.
   */
  getSuggestions(partial, context = {}) {
    const commands = [
      'go', 'look', 'take', 'use', 'hack', 'talk', 'trade',
      'craft', 'equip', 'drop', 'rest', 'inventory', 'status',
      'map', 'save', 'load', 'help',
    ];

    const lower = partial.toLowerCase();
    return commands.filter(c => c.startsWith(lower));
  }
}
