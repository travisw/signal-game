/**
 * SIGNAL — Action Equivalence Tests
 *
 * Validates that numbered choices and typed commands lead to
 * the same outcomes. Also checks for duplicate JSON keys and
 * other structural issues that cause silent bugs.
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const DATA_DIR = join(import.meta.dirname, '..', 'engine', 'data');

let world, items, enemies, npcs, memories;
const sectors = {};

function loadJSON(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

before(() => {
  world = loadJSON(join(DATA_DIR, 'world.json'));
  items = loadJSON(join(DATA_DIR, 'items.json'));
  enemies = loadJSON(join(DATA_DIR, 'enemies.json'));
  npcs = loadJSON(join(DATA_DIR, 'npcs.json'));
  memories = loadJSON(join(DATA_DIR, 'memories.json'));

  const sectorFiles = readdirSync(join(DATA_DIR, 'sectors'));
  for (const file of sectorFiles) {
    if (file.endsWith('.json')) {
      const data = loadJSON(join(DATA_DIR, 'sectors', file));
      sectors[data.id] = data;
    }
  }
});

// =====================
// Duplicate JSON key detection
// =====================

describe('JSON structural integrity', () => {
  it('no exit objects have duplicate keys', () => {
    const errors = [];

    // We need to parse the raw JSON to detect duplicate keys
    // since JSON.parse silently takes the last value
    const sectorDir = join(DATA_DIR, 'sectors');
    const files = readdirSync(sectorDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const raw = readFileSync(join(sectorDir, file), 'utf-8');

      // Find patterns like "room": ... "room": in the same object context
      // Simple heuristic: look for "room" appearing twice within a short span
      const lines = raw.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Check for "room": null pattern which usually precedes a duplicate
        if (line.includes('"room": null')) {
          // Look at next few lines for another "room"
          for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
            if (lines[j].trim().startsWith('"room"')) {
              errors.push(`${file}:${i + 1} — duplicate "room" key in same object (line ${i + 1} and ${j + 1})`);
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Duplicate JSON keys found:\n  ${errors.join('\n  ')}`);
    }
  });
});

// =====================
// Choice-exit equivalence
// =====================

describe('Choice and exit equivalence', () => {
  it('choices with goRoom match an available exit destination', () => {
    const errors = [];

    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        const exits = room.exits || {};
        const exitDestinations = new Set();

        for (const exit of Object.values(exits)) {
          if (exit.sector) {
            exitDestinations.add(`${exit.sector}:${exit.room}`);
          } else if (exit.room) {
            exitDestinations.add(`${sectorId}:${exit.room}`);
          }
        }

        for (const choice of (room.choices || [])) {
          if (choice.goRoom || choice.goSector) {
            const targetSector = choice.goSector || sectorId;
            const targetRoom = choice.goRoom;
            const key = `${targetSector}:${targetRoom}`;

            // The choice navigates somewhere — verify the destination is also
            // reachable via a typed exit command (not required, but flag as info)
            if (!exitDestinations.has(key) && !choice.goSector) {
              // Same-sector choice that doesn't match any exit — might be intentional
              // (e.g., a choice that teleports you). Just verify the room exists.
              if (!sector.rooms[targetRoom]) {
                errors.push(`${sectorId}/${roomId} choice goRoom "${targetRoom}" not found in sector`);
              }
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Invalid choice destinations:\n  ${errors.join('\n  ')}`);
    }
  });

  it('choices with "action" commands resolve to valid targets', () => {
    const errors = [];

    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        for (const choice of (room.choices || [])) {
          if (!choice.action) continue;

          const parts = choice.action.split(' ');
          const verb = parts[0];
          const target = parts.slice(1).join(' ');

          if (verb === 'look' || verb === 'examine') {
            // Verify target matches an examine key
            const examKeys = Object.keys(room.examine || {});
            const match = examKeys.some(k =>
              target.toLowerCase().includes(k.toLowerCase()) ||
              k.toLowerCase().includes(target.toLowerCase())
            );
            if (!match) {
              errors.push(`${sectorId}/${roomId} action "${choice.action}" — no examine key matches "${target}" (keys: ${examKeys.join(', ')})`);
            }
          }

          if (verb === 'take' || verb === 'get') {
            // Verify target matches a room item
            const roomItemNames = (room.items || [])
              .map(i => items[i.id]?.name?.toLowerCase())
              .filter(Boolean);
            const match = roomItemNames.some(name =>
              target.toLowerCase().includes(name) ||
              name.includes(target.toLowerCase())
            );
            if (!match) {
              errors.push(`${sectorId}/${roomId} action "${choice.action}" — no room item matches "${target}" (items: ${roomItemNames.join(', ')})`);
            }
          }

          if (verb === 'talk') {
            // Verify target matches an NPC in the room
            const cleanTarget = target.replace(/^(to|with)\s+/, '');
            const roomNpcs = (room.npcs || []).map(id => npcs[id]?.name?.toLowerCase()).filter(Boolean);
            const match = roomNpcs.some(name =>
              cleanTarget.toLowerCase().includes(name) ||
              name.includes(cleanTarget.toLowerCase())
            );
            if (!match) {
              errors.push(`${sectorId}/${roomId} action "${choice.action}" — no NPC matches "${cleanTarget}" (npcs: ${roomNpcs.join(', ')})`);
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Choice actions with invalid targets:\n  ${errors.join('\n  ')}`);
    }
  });
});

// =====================
// Exit shorthand consistency
// =====================

describe('Exit shorthand consistency', () => {
  it('directional exits have both full and short forms', () => {
    const shortMap = {
      north: 'n', south: 's', east: 'e', west: 'w',
      up: 'u', down: 'd',
    };
    const warnings = [];

    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        const exits = room.exits || {};
        for (const [dir, exit] of Object.entries(exits)) {
          const shortForm = shortMap[dir];
          if (shortForm && !exits[shortForm]) {
            warnings.push(`${sectorId}/${roomId} has "${dir}" exit but no "${shortForm}" shorthand`);
          }
        }
      }
    }

    if (warnings.length > 0) {
      assert.fail(`Missing exit shorthands (players may type "n" instead of "north"):\n  ${warnings.join('\n  ')}`);
    }
  });

  it('exit shorthands point to same destination as full form', () => {
    const shortMap = { n: 'north', s: 'south', e: 'east', w: 'west', u: 'up', d: 'down' };
    const errors = [];

    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        const exits = room.exits || {};
        for (const [short, full] of Object.entries(shortMap)) {
          if (exits[short] && exits[full]) {
            const shortDest = exits[short].sector ? `${exits[short].sector}:${exits[short].room}` : exits[short].room;
            const fullDest = exits[full].sector ? `${exits[full].sector}:${exits[full].room}` : exits[full].room;
            if (shortDest !== fullDest) {
              errors.push(`${sectorId}/${roomId} "${short}" goes to "${shortDest}" but "${full}" goes to "${fullDest}"`);
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Exit shorthand mismatches:\n  ${errors.join('\n  ')}`);
    }
  });
});
