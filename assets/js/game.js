/**
 * SIGNAL — Game Engine
 *
 * Central state machine and game loop. Manages player state,
 * game phases, event bus, and coordinates all subsystems.
 */

import { endings } from './hooks/endings.js';

export class Game {
  constructor(renderer, aiService, baseURL, audio) {
    this.renderer = renderer;
    this.aiService = aiService || null;
    this.baseURL = baseURL || '';
    this.audio = audio || null;

    // Game state phases
    this.phase = 'boot'; // boot, intro, explore, combat, dialogue, gameover

    // Player state
    this.player = {
      name: '???',
      level: 1,
      hp: 100,
      maxHp: 100,
      nrg: 100,
      maxNrg: 100,
      rad: 0,
      maxRad: 100,
      skills: { hack: 0, bio: 0, combat: 0 },
      inventory: [],
      equipment: { weapon: null, armor: null, tool: null },
      memories: [], // collected memory fragment IDs
      flags: {},    // story flags for branching
      factions: {}, // faction reputation scores
    };

    // World state
    this.currentSector = null;
    this.currentRoom = null;
    this.visitedRooms = new Set();
    this.worldData = null;
    this.sectors = {};

    // Time
    this.day = 1;
    this.hour = 6;
    this.minute = 0;

    // Active choices for numbered input
    this.activeChoices = null;

    // Event bus for hooks
    this._listeners = {};

    // Data stores (loaded from JSON)
    this.items = {};
    this.enemies = {};
    this.npcs = {};
    this.memoriesData = {};
    this.asciiArt = {};
  }

  // =====================
  // Event Bus
  // =====================

  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
  }

  emit(event, data) {
    const listeners = this._listeners[event] || [];
    for (const cb of listeners) {
      cb(data);
    }
  }

  // =====================
  // Data Loading
  // =====================

  async loadData() {
    try {
      const [worldData, itemsData, enemiesData, npcsData, memoriesData, asciiArtData, easterEggs] = await Promise.all([
        this._loadJSON('data/world.json', true),
        this._loadJSON('data/items.json', true),
        this._loadJSON('data/enemies.json', true),
        this._loadJSON('data/npcs.json', true),
        this._loadJSON('data/memories.json', true),
        this._loadJSON('data/ascii-art.json', true),
        this._loadJSON('data/easter-eggs.json', true),
      ]);

      this.worldData = worldData;
      this.items = itemsData;
      this.enemies = enemiesData;
      this.npcs = npcsData;
      this.memoriesData = memoriesData;
      this.asciiArt = asciiArtData;
      this.easterEggs = easterEggs;

      return true;
    } catch (e) {
      console.error('Failed to load game data:', e);
      return false;
    }
  }

  async loadSector(sectorId) {
    if (this.sectors[sectorId]) return this.sectors[sectorId];

    try {
      const data = await this._loadJSON(`data/sectors/${sectorId}.json`, true);
      this.sectors[sectorId] = data;
      return data;
    } catch (e) {
      console.error(`Failed to load sector: ${sectorId}`, e);
      return null;
    }
  }

  async _loadJSON(path, useBase = false) {
    const url = useBase ? `${this.baseURL}${path}` : path;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
    return response.json();
  }

  // =====================
  // Game Flow
  // =====================

  async start() {
    this.renderer.setInputEnabled(false);

    // Boot sequence
    this.phase = 'boot';
    await this.renderer.effects.bootSequence(this.renderer.narrative);
    this.renderer.clearNarrative();

    // Load all data
    await this.renderer.printLineTyped('{cyan:Loading world data...}');
    const loaded = await this.loadData();
    if (!loaded) {
      this.renderer.printLine('{pink:ERROR: Failed to load game data.}');
      return;
    }
    this.renderer.clearNarrative();

    // Check for saved game
    this.phase = 'intro';
    this.emit('gameStart', {});

    // Load starting sector
    const startSector = this.worldData.startSector || 'cryo-lab';
    const startRoom = this.worldData.startRoom || 'cryo-chamber';
    await this.enterSector(startSector, startRoom);

    this.renderer.setInputEnabled(true);
  }

  async enterSector(sectorId, roomId) {
    const sector = await this.loadSector(sectorId);
    if (!sector) {
      this.renderer.printLine(`{pink:ERROR: Sector "${sectorId}" not found.}`);
      return;
    }

    this.currentSector = sector;
    await this.renderer.effects.transitionStatic(300);
    await this.enterRoom(roomId || sector.startRoom);
  }

  async enterRoom(roomId) {
    const room = this.currentSector.rooms[roomId];
    if (!room) {
      this.renderer.printLine(`{pink:ERROR: Room "${roomId}" not found.}`);
      this.audio?.error();
      return;
    }

    this.currentRoom = room;
    this.currentRoom._id = roomId;
    this.visitedRooms.add(`${this.currentSector.id}:${roomId}`);

    this.phase = 'explore';

    // Update title bar
    this.renderer.setLocation(this.currentSector.name, room.name);
    this._updateTimeDisplay();
    this._updateHUD();

    // Clear and render room
    this.renderer.clearNarrative();
    this.audio?.transition();

    // ASCII art
    if (room.art) {
      const artData = this.asciiArt[room.art];
      if (artData) {
        this.renderer.printAsciiArt(artData.art);
        this.renderer.printBreak();
      }
    }

    // Room description — check for cached AI variant, fall back to static
    const staticDesc = this._resolveDescription(room);
    const cachedAI = this.aiService?.getCached('roomNarration', this.currentSector.id, roomId);
    const desc = cachedAI?.description || staticDesc;

    this.renderer._isAnimating = true;
    for (const line of desc.split('\n')) {
      if (line.trim()) {
        await this.renderer.printLineTyped(line.trim());
      } else {
        this.renderer.printBreak();
      }
    }
    this.renderer._isAnimating = false;

    // Pre-fetch AI content in background (for this room on revisit + neighbors)
    this._prefetchAIContent(room, roomId);

    // Show items on the ground
    if (room.items && room.items.length > 0) {
      this.renderer.printBreak();
      for (const itemRef of room.items) {
        const item = this.items[itemRef.id];
        if (item && !this._flagSet(`picked_${this.currentSector.id}_${roomId}_${itemRef.id}`)) {
          this.renderer.printLine(`You notice: {amber:${item.name}} ${item.description ? '— ' + item.description : ''}`);
        }
      }
    }

    // Show NPCs
    if (room.npcs && room.npcs.length > 0) {
      for (const npcId of room.npcs) {
        const npc = this.npcs[npcId];
        if (npc) {
          this.renderer.printBreak();
          this.renderer.printLine(`{purple:${npc.name}} is here. ${npc.presence || ''}`);
        }
      }
    }

    // Show exits
    this.renderer.printBreak();
    this._showExits(room);

    // Apply radiation cost
    if (room.radCost && room.radCost > 0) {
      this.player.rad = Math.min(this.player.maxRad, this.player.rad + room.radCost);
      this.renderer.printNotification(`+${room.radCost} RAD`, 'danger');
      this._updateHUD();
    }

    // Auto-generate choices
    this._generateRoomChoices(room);

    // Emit for hooks
    this.emit('enterRoom', { sectorId: this.currentSector.id, roomId, room });

    // Check for encounters
    if (room.encounter && !this._flagSet(`defeated_${this.currentSector.id}_${roomId}`)) {
      await this._triggerEncounter(room.encounter);
    }
  }

  // =====================
  // Command Processing
  // =====================

  async handleCommand(input, { silent = false } = {}) {
    // Reset skip state so typing works fresh for this command
    this.renderer.effects.resetSkip();

    const raw = input.trim().toLowerCase();
    const parts = raw.split(/\s+/);
    const verb = parts[0];
    const rest = parts.slice(1).join(' ');

    // Echo the command (unless called silently from a choice action)
    if (!silent) {
      this.renderer.printBreak();
      this.renderer.printLine(`{dim:> ${input}}`);
      this.renderer.printBreak();
    }

    // Easter egg check — before anything else
    if (this.phase === 'explore' && await this._checkEasterEgg(raw)) {
      return;
    }

    const num = parseInt(raw);

    // Phase-specific handling takes priority — combat and dialogue
    // have their own numbered choice systems
    if (this.phase === 'combat') {
      await this._handleCombatCommand(raw, num);
      return;
    }

    if (this.phase === 'dialogue') {
      await this._handleDialogueCommand(raw, num);
      return;
    }

    // Numbered choice (exploration phase)
    if (num > 0 && this.activeChoices && num <= this.activeChoices.length) {
      await this._executeChoice(this.activeChoices[num - 1]);
      return;
    }

    // Exploration commands
    switch (verb) {
      // Movement
      case 'n': case 'north': case 'go': {
        const dir = verb === 'go' ? rest : verb.replace(/^(n|s|e|w)$/, m =>
          ({ n: 'north', s: 'south', e: 'east', w: 'west' }[m]));
        await this._move(dir);
        break;
      }
      case 's': case 'south':
        await this._move('south');
        break;
      case 'e': case 'east':
        await this._move('east');
        break;
      case 'w': case 'west':
        await this._move('west');
        break;
      case 'u': case 'up':
        await this._move('up');
        break;
      case 'd': case 'down':
        await this._move('down');
        break;
      case 'enter':
        await this._move(rest || 'enter');
        break;
      case 'back':
        await this._move('back');
        break;

      // Examination
      case 'look': case 'l': case 'examine': case 'x':
        await this._look(rest);
        break;

      // Interaction
      case 'take': case 'get': case 'pick':
        await this._takeItem(rest.replace(/^up\s+/, ''));
        break;
      case 'use':
        await this._useItem(rest);
        break;
      case 'hack':
        await this._hackTarget(rest);
        break;
      case 'talk': case 'speak':
        await this._talkTo(rest.replace(/^(to|with)\s+/, ''));
        break;
      case 'trade':
        await this._trade(rest.replace(/^with\s+/, ''));
        break;

      // Meta
      case 'inventory': case 'i': case 'inv':
        this._showInventory();
        break;
      case 'status': case 'stats':
        this._showStatus();
        break;
      case 'map': case 'm':
        this._showMap();
        break;
      case 'help': case 'h': case '?':
        this._showHelp();
        break;
      case 'save':
        await this._save(rest || 'auto');
        break;
      case 'load':
        await this._load(rest || 'auto');
        break;
      case 'craft':
        await this._craft(rest);
        break;
      case 'equip':
        this._equip(rest);
        break;
      case 'drop':
        this._dropItem(rest);
        break;
      case 'rest': case 'sleep':
        await this._rest();
        break;

      default:
        this.renderer.printLine(`{amber:Unknown command.} Type {cyan:help} for available commands.`);
    }
  }

  // =====================
  // Movement
  // =====================

  async _move(direction) {
    if (!this.currentRoom) return;

    const exits = this.currentRoom.exits || {};
    const exit = exits[direction];

    if (!exit) {
      this.renderer.printLine(`{amber:You can't go ${direction} from here.}`);
      return;
    }

    // Check if exit has requirements
    if (exit.requires) {
      if (!this._checkRequirement(exit.requires)) {
        this.renderer.printLine(exit.failText || `{pink:The way is blocked.}`);
        return;
      }
    }

    // Advance time
    this._advanceTime(exit.timeCost || 5);

    // Different sector?
    if (exit.sector) {
      await this.enterSector(exit.sector, exit.room);
    } else {
      await this.enterRoom(exit.room);
    }
  }

  // =====================
  // Look / Examine
  // =====================

  async _look(target) {
    if (!target || target === 'around' || target === '') {
      // Re-describe the room
      const desc = this._resolveDescription(this.currentRoom);
      for (const line of desc.split('\n')) {
        if (line.trim()) {
          this.renderer.printLine(line.trim());
        }
      }
      this.renderer.printBreak();
      this._showExits(this.currentRoom);
      return;
    }

    // Check room's examinable objects
    const examinables = this.currentRoom.examine || {};
    const key = Object.keys(examinables).find(k =>
      target.includes(k.toLowerCase())
    );

    if (key) {
      const exam = examinables[key];
      if (typeof exam === 'string') {
        await this._printMultiline(exam);
      } else {
        await this._printMultiline(exam.text);
        if (exam.giveItem && !this._flagSet(`examined_${key}`)) {
          this._setFlag(`examined_${key}`);
          await this._addItem(exam.giveItem);
        }
        if (exam.setFlag) {
          this._setFlag(exam.setFlag);
        }
        if (exam.revealMemory) {
          await this._revealMemory(exam.revealMemory);
        }
      }
      return;
    }

    // Check NPCs
    if (this.currentRoom.npcs) {
      for (const npcId of this.currentRoom.npcs) {
        const npc = this.npcs[npcId];
        if (npc && target.includes(npc.name.toLowerCase())) {
          this.renderer.printLine(npc.lookDescription || `{purple:${npc.name}} — ${npc.description || 'A person.'}`);
          return;
        }
      }
    }

    // Check inventory items
    const invItem = this.player.inventory.find(i =>
      i.name.toLowerCase().includes(target)
    );
    if (invItem) {
      const itemData = this.items[invItem.id];
      this.renderer.printLine(`{amber:${invItem.name}} — ${itemData?.examineText || itemData?.description || 'Nothing remarkable.'}`);
      return;
    }

    this.renderer.printLine(`{dim:You don't see anything noteworthy about "${target}".}`);
  }

  // =====================
  // Items
  // =====================

  async _takeItem(target) {
    if (!this.currentRoom.items) {
      this.renderer.printLine('{dim:Nothing here to take.}');
      return;
    }

    const roomItem = this.currentRoom.items.find(i => {
      const item = this.items[i.id];
      return item && item.name.toLowerCase().includes(target.toLowerCase());
    });

    if (!roomItem) {
      this.renderer.printLine(`{dim:You don't see "${target}" here.}`);
      return;
    }

    const flagKey = `picked_${this.currentSector.id}_${this.currentRoom._id}_${roomItem.id}`;
    if (this._flagSet(flagKey)) {
      this.renderer.printLine('{dim:You already took that.}');
      return;
    }

    await this._addItem(roomItem.id, roomItem.qty || 1);
    this._setFlag(flagKey);
  }

  async _addItem(itemId, qty = 1) {
    const itemData = this.items[itemId];
    if (!itemData) return;

    // Check inventory space
    const existing = this.player.inventory.find(i => i.id === itemId && itemData.stackable);
    if (existing) {
      existing.qty += qty;
    } else if (this.player.inventory.length >= 12) {
      this.renderer.printLine('{pink:Inventory full!} Drop something first.');
      return;
    } else {
      this.player.inventory.push({
        id: itemId,
        name: itemData.name,
        icon: itemData.icon || '•',
        qty,
      });
    }

    this.renderer.printNotification(`+${qty} ${itemData.name}`, 'info');
    this.audio?.confirm();
    this._updateHUD();
  }

  _removeItem(itemId, qty = 1) {
    const idx = this.player.inventory.findIndex(i => i.id === itemId);
    if (idx === -1) return false;

    const item = this.player.inventory[idx];
    item.qty -= qty;
    if (item.qty <= 0) {
      this.player.inventory.splice(idx, 1);
    }

    this._updateHUD();
    return true;
  }

  hasItem(itemId, qty = 1) {
    const item = this.player.inventory.find(i => i.id === itemId);
    return item && item.qty >= qty;
  }

  async _useItem(target) {
    const invItem = this.player.inventory.find(i =>
      i.name.toLowerCase().includes(target.toLowerCase())
    );

    if (!invItem) {
      this.renderer.printLine(`{dim:You don't have "${target}".}`);
      return;
    }

    const itemData = this.items[invItem.id];
    if (!itemData || !itemData.usable) {
      this.renderer.printLine(`{dim:You can't use ${invItem.name} right now.}`);
      return;
    }

    // Apply item effects
    if (itemData.effects) {
      for (const [stat, value] of Object.entries(itemData.effects)) {
        this._applyStat(stat, value);
      }
    }

    await this.renderer.printLineTyped(itemData.useText || `You use the {amber:${invItem.name}}.`);

    if (itemData.consumable) {
      this._removeItem(invItem.id, 1);
    }

    this._updateHUD();
  }

  _dropItem(target) {
    const idx = this.player.inventory.findIndex(i =>
      i.name.toLowerCase().includes(target.toLowerCase())
    );
    if (idx === -1) {
      this.renderer.printLine(`{dim:You don't have "${target}".}`);
      return;
    }

    const item = this.player.inventory.splice(idx, 1)[0];
    this.renderer.printLine(`Dropped {amber:${item.name}}.`);
    this._updateHUD();
  }

  _equip(target) {
    const invItem = this.player.inventory.find(i =>
      i.name.toLowerCase().includes(target.toLowerCase())
    );
    if (!invItem) {
      this.renderer.printLine(`{dim:You don't have "${target}".}`);
      return;
    }

    const itemData = this.items[invItem.id];
    if (!itemData || !itemData.slot) {
      this.renderer.printLine(`{dim:You can't equip ${invItem.name}.}`);
      return;
    }

    // Unequip current
    const slot = itemData.slot;
    if (this.player.equipment[slot]) {
      this.renderer.printLine(`Unequipped {dim:${this.player.equipment[slot].name}}.`);
    }

    this.player.equipment[slot] = { id: invItem.id, name: invItem.name };
    this.renderer.printLine(`Equipped {amber:${invItem.name}} in ${slot} slot.`);
    this._updateHUD();
  }

  // =====================
  // Hacking
  // =====================

  async _hackTarget(target) {
    if (this.player.skills.hack < 1) {
      this.renderer.printLine('{pink:You don\'t have any HACK skill.} You need engineer memories to unlock this.');
      return;
    }

    const examinables = this.currentRoom.examine || {};
    const key = Object.keys(examinables).find(k =>
      target.includes(k.toLowerCase()) && examinables[k].hackable
    );

    if (!key) {
      this.renderer.printLine(`{dim:Nothing here to hack matching "${target}".}`);
      return;
    }

    const hackable = examinables[key];
    const required = hackable.hackLevel || 1;

    if (this.player.skills.hack < required) {
      this.renderer.printLine(`{pink:HACK level ${required} required.} You're at level ${this.player.skills.hack}.`);
      return;
    }

    // Costs energy
    const nrgCost = required * 10;
    if (this.player.nrg < nrgCost) {
      this.renderer.printLine(`{pink:Not enough NRG.} Need ${nrgCost}, have ${this.player.nrg}.`);
      return;
    }

    this.player.nrg -= nrgCost;
    this._updateHUD();

    this.audio?.hackSequence();
    await this.renderer.printLineTyped('{cyan:Initiating neural handshake...}');
    await this.renderer.effects.glitch(this.renderer.narrative, 1.5, 400);
    this.audio?.confirm();
    await this.renderer.printLineTyped('{green:Connection established.}');
    this.renderer.printBreak();

    if (hackable.hackText) {
      await this.renderer.printLineTyped(hackable.hackText);
    }
    if (hackable.hackGiveItem) {
      await this._addItem(hackable.hackGiveItem);
    }
    if (hackable.hackSetFlag) {
      this._setFlag(hackable.hackSetFlag);
    }
    if (hackable.hackRevealMemory) {
      await this._revealMemory(hackable.hackRevealMemory);
    }
  }

  // =====================
  // Dialogue
  // =====================

  async _talkTo(target) {
    if (!this.currentRoom.npcs) {
      this.renderer.printLine('{dim:Nobody here to talk to.}');
      return;
    }

    const npcId = this.currentRoom.npcs.find(id => {
      const npc = this.npcs[id];
      return npc && npc.name.toLowerCase().includes(target.toLowerCase());
    });

    if (!npcId) {
      this.renderer.printLine(`{dim:You don't see "${target}" here.}`);
      return;
    }

    const npc = this.npcs[npcId];
    this.phase = 'dialogue';
    this._currentDialogueNpc = npc;

    // Find the right dialogue node
    let nodeId = 'start';
    // Check for conditional start nodes
    if (npc.dialogueConditions) {
      for (const cond of npc.dialogueConditions) {
        if (this._checkRequirement(cond.requires)) {
          nodeId = cond.node;
          break;
        }
      }
    }

    await this._showDialogueNode(npc, nodeId);
  }

  async _showDialogueNode(npc, nodeId) {
    const node = npc.dialogue[nodeId];
    if (!node) {
      this.phase = 'explore';
      this._currentDialogueNpc = null;
      return;
    }

    this.renderer.printBreak();
    this.renderer.printLine(`{purple:${npc.name}:} ${node.text}`);

    if (node.setFlag) this._setFlag(node.setFlag);
    if (node.giveItem) await this._addItem(node.giveItem);

    if (node.choices && node.choices.length > 0) {
      this.renderer.printBreak();
      const choices = node.choices.filter(c =>
        !c.requires || this._checkRequirement(c.requires)
      ).map(c => ({
        text: c.text,
        _action: c,
        skillCheck: c.skillCheck ? {
          skill: c.skillCheck.skill,
          level: c.skillCheck.level,
          met: this.player.skills[c.skillCheck.skill] >= c.skillCheck.level,
        } : null,
        disabled: c.skillCheck && this.player.skills[c.skillCheck.skill] < c.skillCheck.level,
      }));

      this.activeChoices = choices;
      this.renderer.showChoices(choices);
    } else {
      // End of dialogue
      this.phase = 'explore';
      this._currentDialogueNpc = null;
      this.activeChoices = null;
    }
  }

  async _handleDialogueCommand(raw, num) {
    if (num > 0 && this.activeChoices && num <= this.activeChoices.length) {
      const choice = this.activeChoices[num - 1];
      if (choice.disabled) {
        this.renderer.printLine(this._failureText(choice.skillCheck));
        return;
      }
      const action = choice._action;
      if (action.next) {
        await this._showDialogueNode(this._currentDialogueNpc, action.next);
      } else {
        this.renderer.printBreak();
        if (action.text) {
          this.renderer.printLine(`{dim:You say:} "${choice.text}"`);
        }
        this.phase = 'explore';
        this._currentDialogueNpc = null;
        this.activeChoices = null;
      }
    } else {
      this.renderer.printLine('{dim:Choose a response by number.}');
    }
  }

  // =====================
  // Trading
  // =====================

  async _trade(target) {
    if (!this.currentRoom.npcs) {
      this.renderer.printLine('{dim:Nobody here to trade with.}');
      return;
    }

    const npcId = this.currentRoom.npcs.find(id => {
      const npc = this.npcs[id];
      return npc && npc.name.toLowerCase().includes(target.toLowerCase()) && npc.trades;
    });

    if (!npcId) {
      this.renderer.printLine(`{dim:Can't trade with "${target}".}`);
      return;
    }

    const npc = this.npcs[npcId];
    this.renderer.printLine(`{purple:${npc.name}} shows you what they have for trade:`);
    this.renderer.printBreak();

    const choices = npc.trades.map(trade => {
      const item = this.items[trade.gives];
      const cost = trade.costs.map(c => {
        const costItem = this.items[c.id];
        return `${c.qty}x ${costItem?.name || c.id}`;
      }).join(', ');
      const canAfford = trade.costs.every(c => this.hasItem(c.id, c.qty));
      return {
        text: `{amber:${item?.name || trade.gives}} — costs: ${cost}`,
        _trade: trade,
        disabled: !canAfford,
      };
    });

    choices.push({ text: '{dim:Done trading}', _trade: null });

    this.activeChoices = choices;
    this.renderer.showChoices(choices);
    this.phase = 'dialogue'; // reuse dialogue phase for trade
    this._currentDialogueNpc = npc;
    this._trading = true;
  }

  // =====================
  // Combat
  // =====================

  async _triggerEncounter(encounterData) {
    const enemyTemplate = this.enemies[encounterData.enemy];
    if (!enemyTemplate) return;

    this.phase = 'combat';
    this._combatEnemy = {
      ...enemyTemplate,
      hp: enemyTemplate.maxHp,
    };

    this.renderer.printBreak();
    await this.renderer.effects.screenShake(200);
    this.audio?.combatAlert();
    this.renderer.printLine(`{pink:⚠ HOSTILE CONTACT — ${enemyTemplate.name}}`);
    this.renderer.printBreak();

    // Show enemy
    const art = enemyTemplate.artId ? this.asciiArt[enemyTemplate.artId]?.art : null;
    this.renderer.showEnemy({
      ...this._combatEnemy,
      art,
    });

    this._showCombatChoices();
  }

  _showCombatChoices() {
    const enemy = this._combatEnemy;

    // Telegraphing: hint at what the enemy will do next
    this._telegraphEnemy(enemy);

    const choices = [];
    const weaponName = this.player.equipment.weapon?.name || 'bare fists';
    choices.push({ text: `Strike with ${weaponName}`, _action: 'attack' });

    // Skill-based options
    if (enemy.type === 'mechanical' || enemy.type === 'electronic') {
      choices.push({
        text: `{cyan:Hack} — breach its firmware`,
        skillCheck: { skill: 'hack', level: enemy.hackLevel || 1, met: this.player.skills.hack >= (enemy.hackLevel || 1) },
        disabled: this.player.skills.hack < (enemy.hackLevel || 1),
        _action: 'hack',
      });
    }

    if (enemy.type === 'organic' || enemy.type === 'mutant') {
      choices.push({
        text: `{green:Bio-scan} — exploit a weakness`,
        skillCheck: { skill: 'bio', level: enemy.bioLevel || 1, met: this.player.skills.bio >= (enemy.bioLevel || 1) },
        disabled: this.player.skills.bio < (enemy.bioLevel || 1),
        _action: 'bio',
      });
    }

    // Talk/intimidate for human enemies
    if (enemy.type === 'human') {
      const combatLevel = this.player.skills.combat;
      choices.push({
        text: `{amber:Intimidate} — make them back down`,
        skillCheck: { skill: 'combat', level: 2, met: combatLevel >= 2 },
        disabled: combatLevel < 2,
        _action: 'intimidate',
      });
    }

    choices.push({ text: 'Use an item from your pack', _action: 'item' });
    choices.push({ text: 'Disengage and retreat', _action: 'flee' });

    this.activeChoices = choices;
    this.renderer.printBreak();
    this.renderer.showChoices(choices);
  }

  _telegraphEnemy(enemy) {
    const hpPct = enemy.hp / enemy.maxHp;
    const telegraphs = {
      mechanical: [
        'Its targeting laser sweeps back and forth, tracking your movement.',
        'Servos whine as it recalibrates. It\'s preparing to strike.',
        'Sparks arc across its chassis. It\'s charging something.',
      ],
      mutant: [
        'It circles to your left, muscles coiled. It\'s about to lunge.',
        'A low growl builds in its throat. The sound vibrates in your chest.',
        'It sniffs the air, eyes locked on you. Calculating.',
      ],
      human: [
        'They shift their weight, weapon raised. Looking for an opening.',
        'Their eyes flick to your pack. They want your supplies, not a fight.',
        'They\'re breathing hard. Not confident. This could go either way.',
      ],
    };

    const pool = telegraphs[enemy.type] || telegraphs.human;
    if (hpPct < 0.3) {
      this.renderer.printLine(`{pink:${enemy.name} is badly damaged, sparking and unstable.}`);
    } else {
      const line = pool[Math.floor(Math.random() * pool.length)];
      this.renderer.printLine(`{dim:${line}}`);
    }
  }

  async _handleCombatCommand(raw, num) {
    if (!num || !this.activeChoices || num > this.activeChoices.length) {
      this.renderer.printLine('{dim:Choose an action by number.}');
      return;
    }

    const choice = this.activeChoices[num - 1];
    if (choice.disabled) {
      this.renderer.printLine(this._failureText(choice.skillCheck));
      return;
    }

    const enemy = this._combatEnemy;
    const action = choice._action;

    if (action === 'flee') {
      this.renderer.printLine('You disengage and fall back!');
      this.phase = 'explore';
      this._combatEnemy = null;
      this.activeChoices = null;
      this._generateRoomChoices(this.currentRoom);
      return;
    }

    if (action === 'item') {
      this._showInventory();
      this.renderer.printLine('{cyan:Type "use <item>" to use an item in combat.}');
      return;
    }

    if (action === 'hack') {
      const nrgCost = 15;
      if (this.player.nrg < nrgCost) {
        this.renderer.printLine(`{pink:Not enough NRG.} Need ${nrgCost}.`);
        return;
      }
      this.player.nrg -= nrgCost;
      this.audio?.hackSequence();
      await this.renderer.printLineTyped('{cyan:Initiating hack sequence...}');
      await this.renderer.effects.glitch(this.renderer.narrative, 1.5, 300);
      enemy.hp = 0;
      this.renderer.printLine(`{green:${enemy.name} disabled!} Systems crash to silence.`);
    } else if (action === 'bio') {
      const nrgCost = 12;
      if (this.player.nrg < nrgCost) {
        this.renderer.printLine(`{pink:Not enough NRG.} Need ${nrgCost}.`);
        return;
      }
      this.player.nrg -= nrgCost;
      await this.renderer.printLineTyped('{green:Scanning biological structure...}');
      const damage = 30 + this.player.skills.bio * 10;
      enemy.hp -= damage;
      this.renderer.printLine(`Weak point exposed. {green:${damage}} critical damage dealt.`);
    } else if (action === 'intimidate') {
      // Non-combat resolution for human enemies
      const nrgCost = 10;
      if (this.player.nrg < nrgCost) {
        this.renderer.printLine(`{pink:Not enough NRG.} Need ${nrgCost}.`);
        return;
      }
      this.player.nrg -= nrgCost;
      await this.renderer.printLineTyped('You step forward. Your voice drops to something flat and final.');
      await this.renderer.printLineTyped(`{amber:"Walk away. Now."}`);
      this.renderer.printBreak();
      enemy.hp = 0;
      this.renderer.printLine(`{green:${enemy.name} backs down.} They melt into the shadows without another word.`);
    } else {
      // Normal attack — vary the flavor text
      const weaponData = this.player.equipment.weapon ? this.items[this.player.equipment.weapon.id] : null;
      const baseDamage = (weaponData?.damage || 5) + this.player.skills.combat * 3;
      const variance = Math.floor(Math.random() * 5) - 2;
      const damage = Math.max(1, baseDamage + variance);
      enemy.hp -= damage;
      const attackFlavor = [
        `You swing hard. {pink:${damage}} damage.`,
        `A solid hit connects. {pink:${damage}} damage dealt.`,
        `You lash out — {pink:${damage}} damage.`,
        `The strike lands true. {pink:${damage}}.`,
      ];
      this.renderer.printLine(attackFlavor[Math.floor(Math.random() * attackFlavor.length)]);
    }

    // Check if enemy is dead
    if (enemy.hp <= 0) {
      await this._combatVictory(enemy);
      return;
    }

    // Enemy turn
    const armorReduction = this.player.equipment.armor ? this.items[this.player.equipment.armor.id]?.defense || 2 : 0;
    const enemyDamage = Math.max(1, enemy.attack - armorReduction + Math.floor(Math.random() * 4) - 2);
    this.player.hp -= enemyDamage;
    const enemyFlavor = {
      mechanical: [
        `${enemy.name} lashes out — {pink:${enemyDamage}} damage.`,
        `A servo-driven strike catches you. {pink:${enemyDamage}} damage.`,
      ],
      mutant: [
        `${enemy.name} lunges, claws raking. {pink:${enemyDamage}} damage.`,
        `It strikes fast — teeth and fury. {pink:${enemyDamage}} damage.`,
      ],
      human: [
        `${enemy.name} swings wild. The blow connects. {pink:${enemyDamage}} damage.`,
        `A desperate strike catches your side. {pink:${enemyDamage}} damage.`,
      ],
    };
    const pool = enemyFlavor[enemy.type] || enemyFlavor.human;
    this.renderer.printLine(`{pink:${pool[Math.floor(Math.random() * pool.length)]}}`);

    if (this.player.hp <= 0) {
      await this._playerDeath();
      return;
    }

    this._updateHUD();

    // Show updated enemy HP
    const art = enemy.artId ? this.asciiArt[enemy.artId]?.art : null;
    this.renderer.showEnemy({ ...enemy, art });
    this._showCombatChoices();
  }

  async _combatVictory(enemy) {
    this.phase = 'explore';
    this._combatEnemy = null;
    this.activeChoices = null;
    this.audio?.confirm();

    await this.renderer.effects.flash('rgba(57, 255, 20, 0.15)', 200);
    this.renderer.printBreak();
    this.renderer.printLine(`{green:${enemy.name} defeated!}`);

    // Set flag so encounter doesn't repeat
    this._setFlag(`defeated_${this.currentSector.id}_${this.currentRoom._id}`);

    // Loot
    if (enemy.loot) {
      for (const loot of enemy.loot) {
        if (Math.random() < (loot.chance || 1)) {
          await this._addItem(loot.id, loot.qty || 1);
        }
      }
    }

    // XP
    if (enemy.xp) {
      this._gainXP(enemy.xp);
    }

    this._updateHUD();

    // Re-show room choices now that combat is over
    this._generateRoomChoices(this.currentRoom);
  }

  async _playerDeath() {
    this.phase = 'gameover';
    this.player.hp = 0;
    this.audio?.death();
    this._updateHUD();

    await this.renderer.effects.flash('rgba(255, 45, 149, 0.3)', 300);
    await this.renderer.effects.screenShake(500);

    this.renderer.printBreak();
    this.renderer.printLine('{pink:━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━}');
    this.renderer.printLine('{pink:  SIGNAL LOST}');
    this.renderer.printLine('{pink:━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━}');
    this.renderer.printBreak();
    this.renderer.printLine('Type {cyan:load} to restore your last save.');
  }

  // =====================
  // Memory Fragments
  // =====================

  async _revealMemory(memoryId) {
    const memory = this.memoriesData[memoryId];
    if (!memory) return;
    if (this.player.memories.includes(memoryId)) return;

    this.player.memories.push(memoryId);

    // Audio + visual effect
    this.audio?.memoryReveal();
    this.renderer.printBreak();
    await this.renderer.effects.memoryReveal(
      this.renderer.narrative,
      memory.text
    );

    // Skill upgrade
    if (memory.skill && memory.skillPoints) {
      this.player.skills[memory.skill] += memory.skillPoints;
      this.renderer.printBreak();
      this.renderer.printNotification(
        `+${memory.skillPoints} ${memory.skill.toUpperCase()} skill unlocked`,
        'success'
      );
    }

    // Story flags
    if (memory.setFlag) {
      this._setFlag(memory.setFlag);
    }

    this._updateHUD();
    this.emit('memoryFound', { memoryId, memory });
  }

  // =====================
  // Crafting
  // =====================

  async _craft(target) {
    if (!target) {
      // Show available recipes
      const available = Object.entries(this.items).filter(([id, item]) => {
        if (!item.recipe) return false;
        return item.recipe.every(r => this.hasItem(r.id, r.qty));
      });

      if (available.length === 0) {
        this.renderer.printLine('{dim:No recipes available with your current materials.}');
        return;
      }

      this.renderer.printLine('{cyan:Available recipes:}');
      for (const [id, item] of available) {
        const cost = item.recipe.map(r => `${r.qty}x ${this.items[r.id]?.name || r.id}`).join(' + ');
        this.renderer.printLine(`  {amber:${item.name}} — ${cost}`);
      }
      this.renderer.printLine('{dim:Type "craft <item name>" to craft.}');
      return;
    }

    // Find matching recipe
    const [itemId, itemData] = Object.entries(this.items).find(([id, item]) =>
      item.recipe && item.name.toLowerCase().includes(target.toLowerCase())
    ) || [];

    if (!itemId) {
      this.renderer.printLine(`{dim:No recipe found for "${target}".}`);
      return;
    }

    // Check materials
    for (const req of itemData.recipe) {
      if (!this.hasItem(req.id, req.qty)) {
        this.renderer.printLine(`{pink:Missing:} ${req.qty}x ${this.items[req.id]?.name || req.id}`);
        return;
      }
    }

    // Consume materials
    for (const req of itemData.recipe) {
      this._removeItem(req.id, req.qty);
    }

    await this._addItem(itemId, 1);
    this.renderer.printLine(`{green:Crafted} {amber:${itemData.name}}!`);
  }

  // =====================
  // Rest
  // =====================

  async _rest() {
    if (!this.currentRoom.canRest) {
      this.renderer.printLine('{amber:This doesn\'t seem like a safe place to rest.}');
      return;
    }

    // Check for food
    const hasFood = this.player.inventory.some(i => this.items[i.id]?.type === 'food');
    if (!hasFood) {
      this.renderer.printLine('{amber:You need food to rest effectively.}');
    }

    await this.renderer.printLineTyped('{dim:You find a spot and rest for a few hours...}');
    this._advanceTime(180); // 3 hours

    // Restore NRG
    const nrgRestore = hasFood ? 50 : 20;
    this.player.nrg = Math.min(this.player.maxNrg, this.player.nrg + nrgRestore);

    // Restore some HP
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 15);

    // Consume food
    if (hasFood) {
      const foodItem = this.player.inventory.find(i => this.items[i.id]?.type === 'food');
      this._removeItem(foodItem.id, 1);
    }

    this.renderer.printLine(`{green:NRG restored} (+${nrgRestore}). {green:HP restored} (+15).`);
    this._updateHUD();
  }

  // =====================
  // UI Commands
  // =====================

  _showInventory() {
    this.renderer.printLine('{cyan:═══ INVENTORY ═══}');
    if (this.player.inventory.length === 0) {
      this.renderer.printLine('{dim:  Empty.}');
    } else {
      for (const item of this.player.inventory) {
        const qty = item.qty > 1 ? ` x${item.qty}` : '';
        const equipped = Object.values(this.player.equipment).some(e => e?.id === item.id) ? ' {green:[equipped]}' : '';
        this.renderer.printLine(`  ${item.icon} {amber:${item.name}}${qty}${equipped}`);
      }
    }
    this.renderer.printLine(`{dim:  ${this.player.inventory.length}/12 slots used}`);
  }

  _showStatus() {
    this.renderer.printLine('{cyan:═══ STATUS ═══}');
    this.renderer.printLine(`  Name:  {bright:${this.player.name}}`);
    this.renderer.printLine(`  Level: {bright:${this.player.level}}`);
    this.renderer.printLine(`  HP:    {green:${this.player.hp}/${this.player.maxHp}}`);
    this.renderer.printLine(`  NRG:   {cyan:${this.player.nrg}/${this.player.maxNrg}}`);
    this.renderer.printLine(`  RAD:   {pink:${this.player.rad}/${this.player.maxRad}}`);
    this.renderer.printBreak();
    this.renderer.printLine('{cyan:Skills:}');
    this.renderer.printLine(`  HACK:   {cyan:${this.player.skills.hack}}`);
    this.renderer.printLine(`  BIO:    {green:${this.player.skills.bio}}`);
    this.renderer.printLine(`  COMBAT: {pink:${this.player.skills.combat}}`);
    this.renderer.printBreak();
    this.renderer.printLine(`{dim:Memories recovered: ${this.player.memories.length}}`);
  }

  _showMap() {
    // Show a text-based sector map
    this.renderer.printLine('{cyan:═══ WORLD MAP ═══}');
    if (!this.worldData) return;

    for (const sector of this.worldData.sectors) {
      const visited = Object.keys(this.sectors).includes(sector.id);
      const current = this.currentSector?.id === sector.id;
      const prefix = current ? '{bright:→}' : visited ? '{green:✓}' : '{dim:?}';
      const color = current ? 'bright' : visited ? 'green' : 'dim';
      this.renderer.printLine(`  ${prefix} {${color}:${sector.name}}`);
    }
  }

  _showExits(room) {
    const exits = room.exits || {};
    const shortToFull = { n: 'north', s: 'south', e: 'east', w: 'west', u: 'up', d: 'down' };
    const fullToShort = Object.fromEntries(Object.entries(shortToFull).map(([k, v]) => [v, k]));

    // Group full directions with their shortcuts, pass through others
    const shown = [];
    const handled = new Set();

    for (const dir of Object.keys(exits)) {
      if (handled.has(dir)) continue;
      handled.add(dir);

      const shortcut = fullToShort[dir];
      if (shortcut && exits[shortcut]) {
        // Full direction with shortcut: "north (n)"
        shown.push(`{cyan:${dir}} {dim:(${shortcut})}`);
        handled.add(shortcut);
      } else if (shortToFull[dir] && exits[shortToFull[dir]]) {
        // Shortcut whose full form was already handled — skip
        continue;
      } else {
        // Standalone (back, enter, northeast, etc.)
        shown.push(`{cyan:${dir}}`);
      }
    }

    if (shown.length > 0) {
      this.renderer.printLine(`Exits: ${shown.join(', ')}`);
    }
  }

  _showHelp() {
    this.renderer.printLine('{cyan:═══ COMMANDS ═══}');
    this.renderer.printLine('  {bright:1-4}           Select from available options');
    this.renderer.printLine('  {bright:n/s/e/w}       Move in a direction');
    this.renderer.printLine('  {bright:go <dir>}      Move (north, south, east, west, up, down)');
    this.renderer.printLine('  {bright:enter <place>} Enter a location');
    this.renderer.printLine('  {bright:look [thing]}  Examine surroundings or an object');
    this.renderer.printLine('  {bright:take <item>}   Pick up an item');
    this.renderer.printLine('  {bright:use <item>}    Use an item');
    this.renderer.printLine('  {bright:hack <target>} Hack a terminal or device');
    this.renderer.printLine('  {bright:talk <person>} Talk to someone');
    this.renderer.printLine('  {bright:trade <person>}Trade with a merchant');
    this.renderer.printLine('  {bright:craft [item]}  Craft items (no args = show recipes)');
    this.renderer.printLine('  {bright:equip <item>}  Equip a weapon or armor');
    this.renderer.printLine('  {bright:drop <item>}   Drop an item');
    this.renderer.printLine('  {bright:rest}          Rest to restore NRG (needs safe area)');
    this.renderer.printLine('  {bright:inventory}     Check your pack (shortcut: i)');
    this.renderer.printLine('  {bright:status}        View your stats');
    this.renderer.printLine('  {bright:map}           View world map');
    this.renderer.printLine('  {bright:save [slot]}   Save game');
    this.renderer.printLine('  {bright:load [slot]}   Load game');
    this.renderer.printLine('  {bright:help}          This message');
  }

  // =====================
  // Save / Load
  // =====================

  async _save(slot) {
    const state = {
      player: this.player,
      currentSector: this.currentSector?.id,
      currentRoom: this.currentRoom?._id,
      visitedRooms: [...this.visitedRooms],
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      version: 1,
    };

    try {
      localStorage.setItem(`signal_save_${slot}`, JSON.stringify(state));
      this.renderer.printNotification(`Game saved to slot "${slot}".`, 'success');
    } catch (e) {
      this.renderer.printLine('{pink:Save failed.}');
    }
  }

  async _load(slot) {
    try {
      const raw = localStorage.getItem(`signal_save_${slot}`);
      if (!raw) {
        this.renderer.printLine(`{amber:No save found in slot "${slot}".}`);
        return;
      }

      const state = JSON.parse(raw);
      this.player = state.player;
      this.visitedRooms = new Set(state.visitedRooms);
      this.day = state.day;
      this.hour = state.hour;
      this.minute = state.minute;

      this.renderer.printNotification(`Game loaded from slot "${slot}".`, 'success');

      // Re-enter sector/room
      await this.enterSector(state.currentSector, state.currentRoom);
    } catch (e) {
      this.renderer.printLine('{pink:Load failed.}');
    }
  }

  // =====================
  // Helpers
  // =====================

  _generateRoomChoices(room) {
    if (room.choices) {
      const choices = room.choices.filter(c =>
        !c.requires || this._checkRequirement(c.requires)
      ).map(c => ({
        ...c,
        skillCheck: c.skillCheck ? {
          ...c.skillCheck,
          met: this.player.skills[c.skillCheck.skill] >= c.skillCheck.level,
        } : null,
      }));

      if (choices.length > 0) {
        this.renderer.printBreak();
        this.activeChoices = choices;
        this.renderer.showChoices(choices);
      }
    } else {
      this.activeChoices = null;
    }
  }

  async _executeChoice(choice) {
    if (choice.disabled) {
      this.renderer.printLine(this._failureText(choice.skillCheck));
      return;
    }

    // If the choice has an action, run it as a command
    if (choice.action) {
      await this.handleCommand(choice.action, { silent: true });
      return;
    }

    if (choice.resultText) {
      await this.renderer.printLineTyped(choice.resultText);
    }

    if (choice.giveItem) await this._addItem(choice.giveItem);
    if (choice.setFlag) this._setFlag(choice.setFlag);
    if (choice.revealMemory) await this._revealMemory(choice.revealMemory);
    if (choice.damage) {
      this.player.hp -= choice.damage;
      this.renderer.printLine(`{pink:You take ${choice.damage} damage!}`);
    }
    if (choice.heal) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + choice.heal);
      this.renderer.printLine(`{green:+${choice.heal} HP}`);
    }
    if (choice.rad) {
      this.player.rad = Math.min(this.player.maxRad, this.player.rad + choice.rad);
      this.renderer.printLine(`{pink:+${choice.rad} RAD}`);
    }
    if (choice.goSector) {
      await this.enterSector(choice.goSector, choice.goRoom);
      return;
    }
    if (choice.goRoom) {
      await this.enterRoom(choice.goRoom);
      return;
    }
    if (choice.encounter) {
      await this._triggerEncounter(choice.encounter);
      return;
    }

    this._updateHUD();
  }

  /**
   * Generate varied, interesting failure text for skill checks.
   */
  _failureText(skillCheck) {
    this.audio?.error();
    if (!skillCheck) return '{pink:You can\'t do that.}';

    const skill = skillCheck.skill;
    const level = skillCheck.level;
    const playerLevel = this.player.skills[skill] || 0;

    const failures = {
      hack: [
        `{pink:Your implant reaches for the system — and hits a wall.} The encryption is beyond you. {dim:HACK ${level} required, yours is ${playerLevel}.}`,
        `{pink:Code fragments swim through your vision, but they won't resolve into meaning.} You need deeper {purple:engineer memories} to crack this.`,
        `{pink:The interface rejects your handshake.} Your HACK skill isn't strong enough — the system barely acknowledges you exist.`,
      ],
      bio: [
        `{pink:You study the organic patterns, but they blur into noise.} Your {purple:scientist memories} are too fragmented to make sense of this. {dim:BIO ${level} required, yours is ${playerLevel}.}`,
        `{pink:The biological signatures are there, but you can't read them.} Like looking at a book in a language you almost remember.`,
        `{pink:Your hands know they should recognize this — but the knowledge isn't there yet.} You need more {purple:scientist memories}.`,
      ],
      combat: [
        `{pink:Your body tenses, but the training isn't there.} The muscle memory is locked behind {purple:operative memories} you haven't recovered. {dim:COMBAT ${level} required, yours is ${playerLevel}.}`,
        `{pink:You know there's a move here — a strike, a feint — but your body won't execute it.} Not enough combat instinct recovered yet.`,
        `{pink:The tactical assessment flickers and dies before it forms.} You need more {purple:operative memories} to pull this off.`,
      ],
    };

    const pool = failures[skill] || [`{pink:You don't have the skill for this.} {dim:${skill.toUpperCase()} ${level} required.}`];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // =====================
  // Easter Eggs
  // =====================

  async _checkEasterEgg(input) {
    if (!this.easterEggs) return false;

    // Strip _meta key
    const egg = this.easterEggs[input];
    if (!egg || input === '_meta') return false;

    // Check if already triggered (non-repeatable)
    if (egg.flag && this._flagSet(egg.flag)) return false;

    // Mark as triggered
    if (egg.flag) this._setFlag(egg.flag);

    this.renderer.printBreak();

    // Dynamic responses
    if (egg.dynamic === 'whoami') {
      const memCount = this.player.memories.length;
      if (memCount === 0) {
        this.renderer.printLine('{cyan:> whoami}\n{dim:UNKNOWN. IDENTITY CORRUPTED. MEMORY FRAGMENTS: 0}');
      } else if (memCount < 5) {
        this.renderer.printLine(`{cyan:> whoami}\n{dim:IDENTITY: PARTIAL. FRAGMENTS RECOVERED: ${memCount}. ROLE: ???}`);
      } else if (this._flagSet('memory_truth_revealed')) {
        this.renderer.printLine('{cyan:> whoami}\n{bright:The engineer. The scientist. The operative. All of them. None of them.\nYou are whoever you decide to be next.}');
      } else {
        this.renderer.printLine(`{cyan:> whoami}\n{dim:IDENTITY: FRAGMENTARY. ${memCount} MEMORIES RECOVERED. THE TRUTH IS CLOSE.}`);
      }
      return true;
    }

    if (egg.dynamic === 'ping') {
      const sectorId = this.currentSector?.id;
      if (sectorId === 'the-descent' || sectorId === 'the-antenna') {
        this.renderer.printLine('{cyan:> ping atlas.core.local}\n{green:REPLY FROM atlas.core.local: bytes=64 time<1ms TTL=∞}\n{green:REPLY FROM atlas.core.local: bytes=64 time<1ms TTL=∞}\n{green:REPLY FROM atlas.core.local: bytes=64 time<1ms TTL=∞}\n\n{pink:ATLAS IS LISTENING.}');
      } else if (sectorId === 'sector-7g') {
        this.renderer.printLine('{cyan:> ping atlas.core.local}\n{amber:REPLY FROM atlas.core.local: bytes=64 time=847ms TTL=12}\n\n{dim:Signal weak. But something answered.}');
      } else {
        this.renderer.printLine('{cyan:> ping atlas.core.local}\n{dim:REQUEST TIMED OUT.}\n{dim:REQUEST TIMED OUT.}\n{dim:REQUEST TIMED OUT.}\n\n{dim:No response. But your implant felt... something.}');
      }
      return true;
    }

    // Standard response
    const lines = egg.response.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        this.renderer.printLine(`{dim:${line}}`);
      } else {
        this.renderer.printBreak();
      }
    }

    // Effects
    if (egg.effect === 'glitch') {
      await this.renderer.effects.glitch(this.renderer.narrative, 1.5, 400);
    } else if (egg.effect === 'shake') {
      await this.renderer.effects.screenShake(300);
    } else if (egg.effect === 'flash_green') {
      await this.renderer.effects.flash('rgba(57, 255, 20, 0.2)', 200);
    } else if (egg.effect === 'flash_pink') {
      await this.renderer.effects.flash('rgba(255, 45, 149, 0.2)', 200);
    } else if (egg.effect === 'flash_purple') {
      await this.renderer.effects.flash('rgba(191, 95, 255, 0.2)', 200);
    } else if (egg.effect === 'barrel_roll') {
      this.renderer.gameContainer.style.transition = 'transform 1s ease-in-out';
      this.renderer.gameContainer.style.transform = 'rotate(360deg)';
      await new Promise(r => setTimeout(r, 1000));
      this.renderer.gameContainer.style.transition = '';
      this.renderer.gameContainer.style.transform = '';
    }

    // Give item
    if (egg.giveItem) {
      await this._addItem(egg.giveItem, 1);
    }

    return true;
  }

  // =====================
  // AI Content Pre-fetch
  // =====================

  _prefetchAIContent(room, roomId) {
    if (!this.aiService?.enabled) return;

    const context = this._buildAIContext(room, this.currentSector.id, roomId);

    // Request for this room (for revisit)
    this.aiService.requestBackground('roomNarration', context);

    // Stagger neighbor pre-fetches — one every 3 seconds to avoid rate limits.
    // Deduplicate exits (n/north both go to same room).
    const exits = room.exits || {};
    const seen = new Set();
    const neighbors = [];

    for (const exit of Object.values(exits)) {
      const targetSectorId = exit.sector || this.currentSector.id;
      const targetRoomId = exit.room;
      if (!targetRoomId) continue;

      const key = `${targetSectorId}:${targetRoomId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const targetSector = this.sectors[targetSectorId] || this.currentSector;
      const neighborRoom = targetSector?.rooms?.[targetRoomId];
      if (neighborRoom) {
        neighbors.push({ room: neighborRoom, sectorId: targetSectorId, roomId: targetRoomId });
      }
    }

    // Stagger: first neighbor after 2s, then one every 3s
    neighbors.forEach((n, i) => {
      setTimeout(() => {
        const ctx = this._buildAIContext(n.room, n.sectorId, n.roomId);
        this.aiService.requestBackground('roomNarration', ctx);
      }, 2000 + i * 3000);
    });
  }

  _buildAIContext(room, sectorId, roomId) {
    const roomKey = `${sectorId}:${roomId}`;
    const visitCount = [...this.visitedRooms].filter(r => r === roomKey).length || 0;

    return {
      sectorId,
      roomId,
      roomName: room.name,
      staticDescription: this._resolveDescription(room),
      timeOfDay: this.hour >= 18 || this.hour < 6 ? 'night' : 'day',
      day: this.day,
      playerSkills: { ...this.player.skills },
      playerHp: this.player.hp,
      playerRad: this.player.rad,
      visitCount,
      activeFlags: Object.keys(this.player.flags),
      memoriesFound: this.player.memories,
      recentEvents: [],
    };
  }

  async _printMultiline(text) {
    this.renderer._isAnimating = true;
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        await this.renderer.printLineTyped(line.trim());
      } else {
        this.renderer.printBreak();
      }
    }
    this.renderer._isAnimating = false;
  }

  _resolveDescription(room) {
    // Check for conditional descriptions
    if (room.conditionalDesc) {
      for (const cond of room.conditionalDesc) {
        if (this._checkRequirement(cond.requires)) {
          return cond.text;
        }
      }
    }
    return room.description || '';
  }

  _checkRequirement(req) {
    if (!req) return true;
    if (req.flag) return this._flagSet(req.flag);
    if (req.notFlag) return !this._flagSet(req.notFlag);
    if (req.hasItem) return this.hasItem(req.hasItem);
    if (req.skill) return this.player.skills[req.skill] >= (req.level || 1);
    if (req.memory) return this.player.memories.includes(req.memory);
    if (req.and) return req.and.every(r => this._checkRequirement(r));
    if (req.or) return req.or.some(r => this._checkRequirement(r));
    return true;
  }

  _flagSet(flag) {
    return !!this.player.flags[flag];
  }

  _setFlag(flag) {
    this.player.flags[flag] = true;

    // Check for ending triggers
    if (flag === 'chose_reboot') {
      this.phase = 'gameover';
      this.renderer.setInputEnabled(false);
      endings.reboot(this).then(() => this.renderer.setInputEnabled(true));
    } else if (flag === 'chose_terminate') {
      this.phase = 'gameover';
      this.renderer.setInputEnabled(false);
      endings.terminate(this).then(() => this.renderer.setInputEnabled(true));
    } else if (flag === 'chose_merge') {
      this.phase = 'gameover';
      this.renderer.setInputEnabled(false);
      endings.merge(this).then(() => this.renderer.setInputEnabled(true));
    }
  }

  _applyStat(stat, value) {
    switch (stat) {
      case 'hp':
        this.player.hp = Math.max(0, Math.min(this.player.maxHp, this.player.hp + value));
        break;
      case 'nrg':
        this.player.nrg = Math.max(0, Math.min(this.player.maxNrg, this.player.nrg + value));
        break;
      case 'rad':
        this.player.rad = Math.max(0, Math.min(this.player.maxRad, this.player.rad + value));
        break;
    }
  }

  _advanceTime(minutes) {
    this.minute += minutes;
    while (this.minute >= 60) {
      this.minute -= 60;
      this.hour++;
    }
    while (this.hour >= 24) {
      this.hour -= 24;
      this.day++;
    }
    this._updateTimeDisplay();
  }

  _updateTimeDisplay() {
    this.renderer.setTime(this.day, this.hour, this.minute);
  }

  _updateHUD() {
    this.renderer.updateHUD({
      name: this.player.name,
      level: this.player.level,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      nrg: this.player.nrg,
      maxNrg: this.player.maxNrg,
      rad: this.player.rad,
      maxRad: this.player.maxRad,
      skills: this.player.skills,
      inventory: this.player.inventory,
      mapData: this._buildMapData(),
    });
  }

  _buildMapData() {
    if (!this.currentSector?.map) return null;

    const map = this.currentSector.map;
    const grid = map.grid.map(row =>
      row.map(cell => {
        if (!cell) return 'unexplored';
        const roomKey = `${this.currentSector.id}:${cell}`;
        if (cell === this.currentRoom?._id) return 'current';
        if (this.visitedRooms.has(roomKey)) return 'visited';
        // Show adjacent rooms as unknown
        const currentExits = this.currentRoom?.exits || {};
        const isAdjacent = Object.values(currentExits).some(e => e.room === cell);
        if (isAdjacent) return 'unknown';
        return 'unexplored';
      })
    );

    return {
      grid,
      legend: { '@': 'you', '#': 'seen', '?': '???' },
    };
  }

  _gainXP(amount) {
    // Simple level-up: every 100 XP = +1 level, +10 max HP, +5 max NRG
    this.player._xp = (this.player._xp || 0) + amount;
    const newLevel = Math.floor(this.player._xp / 100) + 1;
    if (newLevel > this.player.level) {
      this.player.level = newLevel;
      this.player.maxHp += 10;
      this.player.hp = Math.min(this.player.hp + 10, this.player.maxHp);
      this.player.maxNrg += 5;
      this.renderer.printNotification(`Level up! Now level ${newLevel}.`, 'success');
    }
  }
}
