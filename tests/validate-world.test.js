/**
 * SIGNAL — World Data Validation Tests
 *
 * Static analysis of all JSON data files. Validates that:
 * - All sectors load and have valid structure
 * - All room exits point to valid rooms/sectors
 * - All item/enemy/NPC/memory references resolve
 * - All examine targets are internally consistent
 * - All choices have valid actions
 * - All dialogue trees are complete (no dead ends)
 * - No orphaned or unreachable rooms
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const DATA_DIR = join(import.meta.dirname, '..', 'engine', 'data');

// Load all data files
let world, items, enemies, npcs, memories, asciiArt;
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
  asciiArt = loadJSON(join(DATA_DIR, 'ascii-art.json'));

  const sectorFiles = readdirSync(join(DATA_DIR, 'sectors'));
  for (const file of sectorFiles) {
    if (file.endsWith('.json')) {
      const data = loadJSON(join(DATA_DIR, 'sectors', file));
      sectors[data.id] = data;
    }
  }
});

// =====================
// World structure
// =====================

describe('World structure', () => {
  it('world.json has a valid startSector', () => {
    assert.ok(world.startSector, 'startSector is defined');
  });

  it('world.json startSector has a matching sector file', () => {
    assert.ok(sectors[world.startSector], `Sector "${world.startSector}" should exist`);
  });

  it('world.json startRoom exists in start sector', () => {
    const sector = sectors[world.startSector];
    assert.ok(
      sector.rooms[world.startRoom],
      `Room "${world.startRoom}" should exist in sector "${world.startSector}"`
    );
  });

  it('all world.json sectors have matching sector files', () => {
    for (const entry of world.sectors) {
      assert.ok(sectors[entry.id], `Sector file missing for "${entry.id}"`);
    }
  });

  it('all sector files are listed in world.json', () => {
    const worldIds = new Set(world.sectors.map(s => s.id));
    for (const id of Object.keys(sectors)) {
      assert.ok(worldIds.has(id), `Sector "${id}" has a file but is not in world.json`);
    }
  });
});

// =====================
// Sector and room validation
// =====================

describe('Sectors and rooms', () => {
  it('every sector has an id, name, and startRoom', () => {
    for (const [id, sector] of Object.entries(sectors)) {
      assert.ok(sector.id, `Sector missing id`);
      assert.ok(sector.name, `Sector "${id}" missing name`);
      assert.ok(sector.startRoom, `Sector "${id}" missing startRoom`);
      assert.ok(
        sector.rooms[sector.startRoom],
        `Sector "${id}" startRoom "${sector.startRoom}" not found in rooms`
      );
    }
  });

  it('every room has a name and description', () => {
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        assert.ok(room.name, `${sectorId}/${roomId} missing name`);
        assert.ok(room.description, `${sectorId}/${roomId} missing description`);
      }
    }
  });
});

// =====================
// Exit validation
// =====================

describe('Room exits', () => {
  it('all exits point to valid rooms within the same sector', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        const exits = room.exits || {};
        for (const [dir, exit] of Object.entries(exits)) {
          if (exit.sector) {
            // Cross-sector exit
            if (!sectors[exit.sector]) {
              errors.push(`${sectorId}/${roomId} exit "${dir}" -> unknown sector "${exit.sector}"`);
            } else if (!sectors[exit.sector].rooms[exit.room]) {
              errors.push(`${sectorId}/${roomId} exit "${dir}" -> unknown room "${exit.room}" in sector "${exit.sector}"`);
            }
          } else if (exit.room) {
            // Same-sector exit
            if (!sector.rooms[exit.room]) {
              errors.push(`${sectorId}/${roomId} exit "${dir}" -> unknown room "${exit.room}"`);
            }
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid exits:\n  ${errors.join('\n  ')}`);
    }
  });

  it('no rooms are completely unreachable', () => {
    // BFS from world start to find all reachable rooms
    const reachable = new Set();
    const queue = [{ sector: world.startSector, room: world.startRoom }];

    while (queue.length > 0) {
      const { sector: sectorId, room: roomId } = queue.shift();
      const key = `${sectorId}:${roomId}`;
      if (reachable.has(key)) continue;
      reachable.add(key);

      const sector = sectors[sectorId];
      if (!sector) continue;
      const room = sector.rooms[roomId];
      if (!room) continue;

      const exits = room.exits || {};
      for (const exit of Object.values(exits)) {
        const targetSector = exit.sector || sectorId;
        const targetRoom = exit.room;
        if (targetRoom) {
          queue.push({ sector: targetSector, room: targetRoom });
        }
      }

      // Also follow goRoom/goSector in choices
      const choices = room.choices || [];
      for (const choice of choices) {
        if (choice.goSector) {
          queue.push({ sector: choice.goSector, room: choice.goRoom || sectors[choice.goSector]?.startRoom });
        } else if (choice.goRoom) {
          queue.push({ sector: sectorId, room: choice.goRoom });
        }
      }
    }

    const unreachable = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const roomId of Object.keys(sector.rooms)) {
        const key = `${sectorId}:${roomId}`;
        if (!reachable.has(key)) {
          unreachable.push(key);
        }
      }
    }

    if (unreachable.length > 0) {
      assert.fail(`Unreachable rooms:\n  ${unreachable.join('\n  ')}`);
    }
  });
});

// =====================
// Item references
// =====================

describe('Item references', () => {
  it('all room items reference valid item IDs', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        for (const itemRef of (room.items || [])) {
          if (!items[itemRef.id]) {
            errors.push(`${sectorId}/${roomId} has unknown item "${itemRef.id}"`);
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid item references:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all giveItem references in examine/choices/dialogue are valid', () => {
    const errors = [];

    // Check examine objects
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        for (const [key, exam] of Object.entries(room.examine || {})) {
          if (typeof exam === 'object' && exam.giveItem && !items[exam.giveItem]) {
            errors.push(`${sectorId}/${roomId} examine "${key}" giveItem "${exam.giveItem}" not found`);
          }
          if (typeof exam === 'object' && exam.hackGiveItem && !items[exam.hackGiveItem]) {
            errors.push(`${sectorId}/${roomId} examine "${key}" hackGiveItem "${exam.hackGiveItem}" not found`);
          }
        }

        // Check choices
        for (const choice of (room.choices || [])) {
          if (choice.giveItem && !items[choice.giveItem]) {
            errors.push(`${sectorId}/${roomId} choice giveItem "${choice.giveItem}" not found`);
          }
        }
      }
    }

    // Check NPC dialogue
    for (const [npcId, npc] of Object.entries(npcs)) {
      for (const [nodeId, node] of Object.entries(npc.dialogue || {})) {
        if (node.giveItem && !items[node.giveItem]) {
          errors.push(`NPC "${npcId}" dialogue "${nodeId}" giveItem "${node.giveItem}" not found`);
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Invalid giveItem references:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all crafting recipes reference valid ingredients', () => {
    const errors = [];
    for (const [itemId, item] of Object.entries(items)) {
      if (item.recipe) {
        for (const ingredient of item.recipe) {
          if (!items[ingredient.id]) {
            errors.push(`Item "${itemId}" recipe needs unknown item "${ingredient.id}"`);
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid recipe references:\n  ${errors.join('\n  ')}`);
    }
  });
});

// =====================
// Enemy references
// =====================

describe('Enemy references', () => {
  it('all encounter references point to valid enemies', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        if (room.encounter) {
          if (!enemies[room.encounter.enemy]) {
            errors.push(`${sectorId}/${roomId} encounter references unknown enemy "${room.encounter.enemy}"`);
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid enemy references:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all enemy loot references valid items', () => {
    const errors = [];
    for (const [enemyId, enemy] of Object.entries(enemies)) {
      for (const loot of (enemy.loot || [])) {
        if (!items[loot.id]) {
          errors.push(`Enemy "${enemyId}" loot references unknown item "${loot.id}"`);
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid loot references:\n  ${errors.join('\n  ')}`);
    }
  });
});

// =====================
// NPC references
// =====================

describe('NPC references', () => {
  it('all room NPC references point to valid NPCs', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        for (const npcId of (room.npcs || [])) {
          if (!npcs[npcId]) {
            errors.push(`${sectorId}/${roomId} references unknown NPC "${npcId}"`);
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid NPC references:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all NPC dialogue trees have no dead-end references', () => {
    const errors = [];
    for (const [npcId, npc] of Object.entries(npcs)) {
      const dialogue = npc.dialogue || {};
      for (const [nodeId, node] of Object.entries(dialogue)) {
        for (const choice of (node.choices || [])) {
          if (choice.next && !dialogue[choice.next]) {
            errors.push(`NPC "${npcId}" dialogue "${nodeId}" choice references missing node "${choice.next}"`);
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Dialogue dead ends:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all NPC dialogue trees are reachable from "start"', () => {
    const errors = [];
    for (const [npcId, npc] of Object.entries(npcs)) {
      const dialogue = npc.dialogue || {};
      if (!dialogue.start) {
        errors.push(`NPC "${npcId}" has no "start" dialogue node`);
        continue;
      }

      // BFS from start
      const reachable = new Set();
      const queue = ['start'];
      while (queue.length > 0) {
        const nodeId = queue.shift();
        if (reachable.has(nodeId)) continue;
        reachable.add(nodeId);
        const node = dialogue[nodeId];
        if (!node) continue;
        for (const choice of (node.choices || [])) {
          if (choice.next) queue.push(choice.next);
        }
      }

      // Check for conditional start nodes
      for (const cond of (npc.dialogueConditions || [])) {
        if (cond.node) reachable.add(cond.node);
      }

      for (const nodeId of Object.keys(dialogue)) {
        if (!reachable.has(nodeId)) {
          errors.push(`NPC "${npcId}" dialogue node "${nodeId}" is unreachable from "start"`);
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Unreachable dialogue nodes:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all NPC trade references are valid', () => {
    const errors = [];
    for (const [npcId, npc] of Object.entries(npcs)) {
      for (const trade of (npc.trades || [])) {
        if (!items[trade.gives]) {
          errors.push(`NPC "${npcId}" trade gives unknown item "${trade.gives}"`);
        }
        for (const cost of (trade.costs || [])) {
          if (!items[cost.id]) {
            errors.push(`NPC "${npcId}" trade costs unknown item "${cost.id}"`);
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid trade references:\n  ${errors.join('\n  ')}`);
    }
  });
});

// =====================
// Memory references
// =====================

describe('Memory references', () => {
  it('all revealMemory references point to valid memories', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        // Check examine objects
        for (const [key, exam] of Object.entries(room.examine || {})) {
          if (typeof exam === 'object') {
            if (exam.revealMemory && !memories[exam.revealMemory]) {
              errors.push(`${sectorId}/${roomId} examine "${key}" revealMemory "${exam.revealMemory}" not found`);
            }
            if (exam.hackRevealMemory && !memories[exam.hackRevealMemory]) {
              errors.push(`${sectorId}/${roomId} examine "${key}" hackRevealMemory "${exam.hackRevealMemory}" not found`);
            }
          }
        }
        // Check choices
        for (const choice of (room.choices || [])) {
          if (choice.revealMemory && !memories[choice.revealMemory]) {
            errors.push(`${sectorId}/${roomId} choice revealMemory "${choice.revealMemory}" not found`);
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid memory references:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all memories have valid skill types', () => {
    const validSkills = ['hack', 'bio', 'combat', null];
    const errors = [];
    for (const [memId, mem] of Object.entries(memories)) {
      if (!validSkills.includes(mem.skill)) {
        errors.push(`Memory "${memId}" has invalid skill "${mem.skill}"`);
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid memory skills:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all memories are discoverable somewhere in the game', () => {
    const referenced = new Set();

    for (const sector of Object.values(sectors)) {
      for (const room of Object.values(sector.rooms)) {
        for (const exam of Object.values(room.examine || {})) {
          if (typeof exam === 'object') {
            if (exam.revealMemory) referenced.add(exam.revealMemory);
            if (exam.hackRevealMemory) referenced.add(exam.hackRevealMemory);
          }
        }
        for (const choice of (room.choices || [])) {
          if (choice.revealMemory) referenced.add(choice.revealMemory);
        }
      }
    }

    const undiscoverable = [];
    for (const memId of Object.keys(memories)) {
      if (!referenced.has(memId)) {
        undiscoverable.push(memId);
      }
    }
    if (undiscoverable.length > 0) {
      assert.fail(`Memories with no way to discover them:\n  ${undiscoverable.join('\n  ')}`);
    }
  });
});

// =====================
// ASCII art references
// =====================

describe('ASCII art references', () => {
  it('all room art references point to valid ASCII art', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        if (room.art && !asciiArt[room.art]) {
          errors.push(`${sectorId}/${roomId} references unknown art "${room.art}"`);
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid ASCII art references:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all enemy artId references point to valid ASCII art', () => {
    const errors = [];
    for (const [enemyId, enemy] of Object.entries(enemies)) {
      if (enemy.artId && !asciiArt[enemy.artId]) {
        errors.push(`Enemy "${enemyId}" references unknown art "${enemy.artId}"`);
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid enemy art references:\n  ${errors.join('\n  ')}`);
    }
  });
});

// =====================
// Choice/action consistency
// =====================

describe('Choice and action consistency', () => {
  it('all choice goRoom references are valid', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        for (const choice of (room.choices || [])) {
          if (choice.goRoom && !choice.goSector) {
            if (!sector.rooms[choice.goRoom]) {
              errors.push(`${sectorId}/${roomId} choice goRoom "${choice.goRoom}" not found in sector`);
            }
          }
          if (choice.goSector) {
            if (!sectors[choice.goSector]) {
              errors.push(`${sectorId}/${roomId} choice goSector "${choice.goSector}" not found`);
            } else if (choice.goRoom && !sectors[choice.goSector].rooms[choice.goRoom]) {
              errors.push(`${sectorId}/${roomId} choice goRoom "${choice.goRoom}" not found in sector "${choice.goSector}"`);
            }
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Invalid choice navigation:\n  ${errors.join('\n  ')}`);
    }
  });

  it('all choice action commands are plausible', () => {
    const validVerbs = ['look', 'take', 'hack', 'use', 'talk', 'trade', 'examine'];
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        for (const choice of (room.choices || [])) {
          if (choice.action) {
            const verb = choice.action.split(' ')[0];
            if (!validVerbs.includes(verb)) {
              errors.push(`${sectorId}/${roomId} choice action "${choice.action}" has unexpected verb "${verb}"`);
            }
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Suspicious choice actions:\n  ${errors.join('\n  ')}`);
    }
  });

  it('choice actions that use "look" target valid examine keys', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        for (const choice of (room.choices || [])) {
          if (choice.action && choice.action.startsWith('look ')) {
            const target = choice.action.replace('look ', '').toLowerCase();
            const examKeys = Object.keys(room.examine || {}).map(k => k.toLowerCase());
            const hasMatch = examKeys.some(k => target.includes(k) || k.includes(target));
            if (!hasMatch) {
              errors.push(`${sectorId}/${roomId} choice action "${choice.action}" — no matching examine key (available: ${examKeys.join(', ')})`);
            }
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Choice actions with no matching examine target:\n  ${errors.join('\n  ')}`);
    }
  });

  it('choice actions that use "take" target items present in the room', () => {
    const errors = [];
    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        for (const choice of (room.choices || [])) {
          if (choice.action && choice.action.startsWith('take ')) {
            const target = choice.action.replace('take ', '').toLowerCase();
            const roomItems = (room.items || []).map(i => items[i.id]?.name?.toLowerCase()).filter(Boolean);
            const hasMatch = roomItems.some(name => name.includes(target) || target.includes(name));
            if (!hasMatch) {
              errors.push(`${sectorId}/${roomId} choice action "take ${target}" — no matching room item (available: ${roomItems.join(', ')})`);
            }
          }
        }
      }
    }
    if (errors.length > 0) {
      assert.fail(`Choice actions with no matching item:\n  ${errors.join('\n  ')}`);
    }
  });
});

// =====================
// Color markup consistency
// =====================

describe('Color markup consistency', () => {
  it('no broken color markup tags in any text', () => {
    const errors = [];
    const tagRegex = /\{(\w+):[^}]*$/; // unclosed tag

    function checkText(text, location) {
      if (!text) return;
      // Check for unclosed tags
      const lines = text.split('\n');
      for (const line of lines) {
        let depth = 0;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '{' && i + 1 < line.length && /\w/.test(line[i + 1])) {
            depth++;
          } else if (line[i] === '}' && depth > 0) {
            depth--;
          }
        }
        if (depth > 0) {
          errors.push(`${location}: unclosed color tag in "${line.slice(0, 60)}..."`);
        }
      }
    }

    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        const loc = `${sectorId}/${roomId}`;
        checkText(room.description, `${loc} description`);
        for (const [key, exam] of Object.entries(room.examine || {})) {
          const text = typeof exam === 'string' ? exam : exam.text;
          checkText(text, `${loc} examine "${key}"`);
          if (typeof exam === 'object' && exam.hackText) {
            checkText(exam.hackText, `${loc} examine "${key}" hackText`);
          }
        }
        for (const choice of (room.choices || [])) {
          checkText(choice.text, `${loc} choice`);
          checkText(choice.resultText, `${loc} choice resultText`);
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Broken color markup:\n  ${errors.join('\n  ')}`);
    }
  });
});
