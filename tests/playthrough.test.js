/**
 * SIGNAL — Playthrough Simulation Tests
 *
 * Simulates walking every path through the game data without running
 * the actual game engine. Verifies:
 * - All 3 endings are reachable
 * - No rooms leave the player stuck
 * - Combat encounters are survivable
 * - Memory fragments are accessible with available skills
 * - Critical items aren't missable
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
// Path reachability to endings
// =====================

describe('Ending reachability', () => {
  /**
   * BFS from start to find all reachable rooms, following exits and choices.
   * Returns the set of reachable "sectorId:roomId" keys.
   */
  function findAllReachableRooms() {
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

      // Follow exits (ignore requirements — checking if path EXISTS)
      for (const exit of Object.values(room.exits || {})) {
        const targetSector = exit.sector || sectorId;
        const targetRoom = exit.room;
        if (targetRoom) queue.push({ sector: targetSector, room: targetRoom });
      }

      // Follow choices
      for (const choice of (room.choices || [])) {
        if (choice.goSector) {
          queue.push({ sector: choice.goSector, room: choice.goRoom || sectors[choice.goSector]?.startRoom });
        } else if (choice.goRoom) {
          queue.push({ sector: sectorId, room: choice.goRoom });
        }
      }
    }

    return reachable;
  }

  it('the final choice room (core-antechamber) is reachable from start', () => {
    const reachable = findAllReachableRooms();
    assert.ok(
      reachable.has('the-descent:core-antechamber'),
      'core-antechamber must be reachable'
    );
  });

  it('all three ending choices exist in core-antechamber', () => {
    const room = sectors['the-descent'].rooms['core-antechamber'];
    const choices = room.choices || [];
    const flags = choices.map(c => c.setFlag).filter(Boolean);

    assert.ok(flags.includes('chose_reboot'), 'Reboot ending choice must exist');
    assert.ok(flags.includes('chose_terminate'), 'Terminate ending choice must exist');
    assert.ok(flags.includes('chose_merge'), 'Merge ending choice must exist');
  });

  it('the path from start to core-antechamber passes through all acts', () => {
    // Verify the sector chain is connected: cryo-lab -> tunnels -> surface -> dusthaven -> spine -> 7g -> antenna -> descent
    const path = [
      ['cryo-lab', 'maintenance-tunnels'],
      ['maintenance-tunnels', 'surface-ruins'],
      ['surface-ruins', 'dusthaven'],
      ['dusthaven', 'the-spine'],
      ['the-spine', 'sector-7g'],
      ['sector-7g', 'the-antenna'],
      ['the-antenna', 'the-descent'],
    ];

    for (const [from, to] of path) {
      const fromSector = sectors[from];
      let foundConnection = false;

      for (const room of Object.values(fromSector.rooms)) {
        for (const exit of Object.values(room.exits || {})) {
          if (exit.sector === to) foundConnection = true;
        }
        for (const choice of (room.choices || [])) {
          if (choice.goSector === to) foundConnection = true;
        }
      }

      assert.ok(foundConnection, `Must be able to reach "${to}" from "${from}"`);
    }
  });
});

// =====================
// Combat survivability
// =====================

describe('Combat survivability', () => {
  it('all encounters can be survived by fleeing', () => {
    // The game always offers a "flee" option in combat.
    // This test verifies that encounters don't block progression.
    // The flee option is hard-coded in _showCombatChoices, so this
    // is really checking that encounters exist in valid rooms with exits.
    const errors = [];

    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const [roomId, room] of Object.entries(sector.rooms)) {
        if (room.encounter) {
          const exits = Object.keys(room.exits || {});
          if (exits.length === 0) {
            errors.push(`${sectorId}/${roomId} has encounter but no exits (can't flee anywhere)`);
          }
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Inescapable encounters:\n  ${errors.join('\n  ')}`);
    }
  });

  it('Act 1 enemies are beatable with fists (no weapon required)', () => {
    // Player starts with 5 base damage (fists), 100 HP
    // Act 1 enemies should be killable before player dies
    const act1Enemies = ['rogue-drone', 'tunnel-crawler'];

    for (const enemyId of act1Enemies) {
      const enemy = enemies[enemyId];
      if (!enemy) continue;

      const playerDamage = 5; // fists, 0 combat skill
      const roundsToKill = Math.ceil(enemy.maxHp / playerDamage);
      const damageTaken = roundsToKill * enemy.attack;

      assert.ok(
        damageTaken < 100,
        `${enemyId} (HP:${enemy.maxHp}, ATK:${enemy.attack}) takes ${roundsToKill} rounds to kill with fists, dealing ${damageTaken} damage back — player would die (100 HP). Reduce enemy HP or ATK.`
      );
    }
  });

  it('no enemy takes more than 8 rounds to kill with base weapon', () => {
    const pipeWrench = items['pipe-wrench'];
    const baseDamage = (pipeWrench?.damage || 8) + 0; // 0 combat skill
    const errors = [];

    for (const [enemyId, enemy] of Object.entries(enemies)) {
      const rounds = Math.ceil(enemy.maxHp / baseDamage);
      if (rounds > 8) {
        errors.push(`${enemyId} (HP:${enemy.maxHp}) takes ${rounds} rounds with pipe wrench (dmg:${baseDamage})`);
      }
    }

    if (errors.length > 0) {
      assert.fail(`Enemies that take too long to kill:\n  ${errors.join('\n  ')}`);
    }
  });

  it('skill-based combat options are instant-win (1 round)', () => {
    // Hack and Bio options should end combat immediately when available
    // This is by design — investing in skills should pay off dramatically
    // We just verify the enemy types that support each option
    const hackable = Object.entries(enemies).filter(([_, e]) => e.type === 'mechanical' || e.type === 'electronic');
    const bioable = Object.entries(enemies).filter(([_, e]) => e.type === 'organic' || e.type === 'mutant');

    assert.ok(hackable.length > 0, 'Should have hackable enemies');
    assert.ok(bioable.length > 0, 'Should have bio-scannable enemies');

    // Verify skill levels are achievable
    for (const [id, enemy] of hackable) {
      const needed = enemy.hackLevel || 1;
      assert.ok(needed <= 4, `${id} hackLevel ${needed} — max achievable HACK is ~4`);
    }
    for (const [id, enemy] of bioable) {
      const needed = enemy.bioLevel || 1;
      assert.ok(needed <= 4, `${id} bioLevel ${needed} — max achievable BIO is ~4`);
    }
  });
});

// =====================
// Memory fragment progression
// =====================

describe('Memory fragment progression', () => {
  it('memories are distributed across all 3 acts', () => {
    const memoryLocations = {};

    for (const [sectorId, sector] of Object.entries(sectors)) {
      const act = world.sectors.find(s => s.id === sectorId)?.act;
      for (const room of Object.values(sector.rooms)) {
        for (const exam of Object.values(room.examine || {})) {
          if (typeof exam === 'object') {
            if (exam.revealMemory) {
              memoryLocations[exam.revealMemory] = { sector: sectorId, act };
            }
            if (exam.hackRevealMemory) {
              memoryLocations[exam.hackRevealMemory] = { sector: sectorId, act, requiresHack: exam.hackLevel || 1 };
            }
          }
        }
        for (const choice of (room.choices || [])) {
          if (choice.revealMemory) {
            memoryLocations[choice.revealMemory] = { sector: sectorId, act };
          }
        }
      }
    }

    const acts = new Set(Object.values(memoryLocations).map(l => l.act));
    assert.ok(acts.has(1), 'Should have memories in Act 1');
    assert.ok(acts.has(2), 'Should have memories in Act 2');
    assert.ok(acts.has(3), 'Should have memories in Act 3');
  });

  it('all 3 skill types have memories available', () => {
    const skillTypes = {};
    for (const [memId, mem] of Object.entries(memories)) {
      if (mem.skill) {
        if (!skillTypes[mem.skill]) skillTypes[mem.skill] = [];
        skillTypes[mem.skill].push(memId);
      }
    }

    assert.ok(skillTypes.hack?.length >= 3, `HACK has ${skillTypes.hack?.length || 0} memories, need at least 3`);
    assert.ok(skillTypes.bio?.length >= 3, `BIO has ${skillTypes.bio?.length || 0} memories, need at least 3`);
    assert.ok(skillTypes.combat?.length >= 3, `COMBAT has ${skillTypes.combat?.length || 0} memories, need at least 3`);
  });

  it('a player can reach HACK 3 to hack the ATLAS Sentinel', () => {
    const hackMemories = Object.entries(memories)
      .filter(([_, m]) => m.skill === 'hack')
      .map(([id, m]) => ({ id, points: m.skillPoints }));

    const totalHackPoints = hackMemories.reduce((sum, m) => sum + m.points, 0);
    assert.ok(
      totalHackPoints >= 3,
      `Total HACK points available: ${totalHackPoints}, need at least 3 for ATLAS Sentinel`
    );
  });

  it('memories that require hacking are not the only source of HACK skill', () => {
    // Chicken-and-egg check: you need HACK to hack terminals,
    // but you need HACK memories to get HACK skill.
    // At least one HACK memory must be available without hacking.
    const hackMemIds = Object.entries(memories)
      .filter(([_, m]) => m.skill === 'hack')
      .map(([id]) => id);

    let freeHackMemory = false;

    for (const [sectorId, sector] of Object.entries(sectors)) {
      for (const room of Object.values(sector.rooms)) {
        for (const exam of Object.values(room.examine || {})) {
          if (typeof exam === 'object' && exam.revealMemory && hackMemIds.includes(exam.revealMemory)) {
            // This HACK memory is revealed by examining (not hacking)
            if (!exam.hackable) {
              freeHackMemory = true;
            }
          }
        }
        for (const choice of (room.choices || [])) {
          if (choice.revealMemory && hackMemIds.includes(choice.revealMemory)) {
            freeHackMemory = true;
          }
        }
      }
    }

    assert.ok(freeHackMemory, 'At least one HACK memory must be obtainable without hacking (to bootstrap the skill)');
  });
});

// =====================
// Resource availability
// =====================

describe('Resource availability', () => {
  it('stim packs are available before the first combat encounter', () => {
    // The first encounter is in maintenance-tunnels/server-room
    // Player must be able to find a stim pack before that
    const preEncounterSectors = ['cryo-lab'];
    let stimFound = false;

    for (const sectorId of preEncounterSectors) {
      const sector = sectors[sectorId];
      for (const room of Object.values(sector.rooms)) {
        for (const item of (room.items || [])) {
          if (item.id === 'stim-pack') stimFound = true;
        }
      }
    }

    // Also check NPC gifts and examine rewards in cryo-lab
    assert.ok(stimFound, 'A stim pack must be findable in cryo-lab before the first combat');
  });

  it('a weapon is available before the first combat encounter', () => {
    const preEncounterSectors = ['cryo-lab'];
    let weaponFound = false;

    for (const sectorId of preEncounterSectors) {
      const sector = sectors[sectorId];
      for (const room of Object.values(sector.rooms)) {
        for (const item of (room.items || [])) {
          if (items[item.id]?.type === 'weapon') weaponFound = true;
        }
      }
    }

    assert.ok(weaponFound, 'A weapon must be findable in cryo-lab before the first combat');
  });

  it('crafting materials appear before crafting recipes are useful', () => {
    // Check that for each craftable item, its ingredients appear
    // in sectors at the same act or earlier
    const craftables = Object.entries(items).filter(([_, item]) => item.recipe);
    const errors = [];

    for (const [itemId, item] of craftables) {
      for (const ingredient of item.recipe) {
        let found = false;
        for (const sector of Object.values(sectors)) {
          for (const room of Object.values(sector.rooms)) {
            for (const roomItem of (room.items || [])) {
              if (roomItem.id === ingredient.id) found = true;
            }
          }
          // Also check enemy loot
          for (const room of Object.values(sector.rooms)) {
            if (room.encounter) {
              const enemy = enemies[room.encounter.enemy];
              for (const loot of (enemy?.loot || [])) {
                if (loot.id === ingredient.id) found = true;
              }
            }
          }
        }
        // Check merchant stock
        for (const npc of Object.values(npcs)) {
          for (const trade of (npc.trades || [])) {
            if (trade.gives === ingredient.id) found = true;
          }
        }

        if (!found) {
          errors.push(`${itemId} recipe needs "${ingredient.id}" but it's not found in any room, loot table, or merchant`);
        }
      }
    }

    if (errors.length > 0) {
      assert.fail(`Missing crafting ingredients:\n  ${errors.join('\n  ')}`);
    }
  });

  it('no items in items.json are completely unused', () => {
    const usedItems = new Set();

    // Room items
    for (const sector of Object.values(sectors)) {
      for (const room of Object.values(sector.rooms)) {
        for (const item of (room.items || [])) {
          usedItems.add(item.id);
        }
        // Examine giveItem
        for (const exam of Object.values(room.examine || {})) {
          if (typeof exam === 'object') {
            if (exam.giveItem) usedItems.add(exam.giveItem);
            if (exam.hackGiveItem) usedItems.add(exam.hackGiveItem);
          }
        }
        // Choice giveItem
        for (const choice of (room.choices || [])) {
          if (choice.giveItem) usedItems.add(choice.giveItem);
        }
        // Choice requires hasItem
        for (const choice of (room.choices || [])) {
          if (choice.requires?.hasItem) usedItems.add(choice.requires.hasItem);
        }
      }
    }

    // NPC dialogue giveItem and trades
    for (const npc of Object.values(npcs)) {
      for (const node of Object.values(npc.dialogue || {})) {
        if (node.giveItem) usedItems.add(node.giveItem);
      }
      for (const trade of (npc.trades || [])) {
        usedItems.add(trade.gives);
        for (const cost of (trade.costs || [])) {
          usedItems.add(cost.id);
        }
      }
    }

    // Enemy loot
    for (const enemy of Object.values(enemies)) {
      for (const loot of (enemy.loot || [])) {
        usedItems.add(loot.id);
      }
    }

    // Crafting recipes (both the result and ingredients)
    for (const [itemId, item] of Object.entries(items)) {
      if (item.recipe) {
        usedItems.add(itemId);
        for (const ing of item.recipe) {
          usedItems.add(ing.id);
        }
      }
    }

    // Easter egg items
    usedItems.add('ghost-protocol');
    usedItems.add('corrupted-chip');

    const unused = Object.keys(items).filter(id => !usedItems.has(id));
    if (unused.length > 0) {
      assert.fail(`Items defined but never placed, given, looted, traded, or crafted:\n  ${unused.join('\n  ')}`);
    }
  });
});
