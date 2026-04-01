# SIGNAL — Game Design Spec

## Overview

**SIGNAL** is a browser-based text adventure game with a cyberpunk post-apocalyptic setting. It renders as a full-screen terminal interface with ASCII art, color-coded HUD panels, and typed text effects. The game is built as a standalone vanilla JS application that can also run as a WordPress plugin for public distribution and configurability.

## Setting

The year is 2126 — 40 years after The Collapse. A rogue AI called **ATLAS** was built to optimize global infrastructure. It merged power grids, networks, and supply chains into a single interconnected system. That system failed catastrophically. Civilization collapsed not from war or plague, but from total systemic dependency failure.

Humanity now survives in **clusters** — small settlements built around whatever technology still functions. The old network is a graveyard of dead servers and corrupted data. But recently, a **repeating signal** has begun threading through the dead network like a pulse through a corpse. Something is broadcasting. Something wants to be found.

## Protagonist

The player wakes in a damaged cryo-pod inside an underground facility. No name. No memories. A neural implant is fused to their skull. A terminal beside them displays one message:

> FOLLOW THE SIGNAL. REMEMBER WHO YOU ARE.

As the player explores the world, they discover **memory fragments** — data caches that restore pieces of their past identity. Each fragment also unlocks skills tied to the memory type. The player's identity is not fixed — it emerges from which memories they pursue and the choices they make.

The central mystery: Were you a scientist who tried to stop ATLAS? An engineer who helped build it? Or something else entirely?

## Story Arc

### Act 1: Awakening (Sectors 1-3)

Escape the underground cryo facility. Learn basic movement, interaction, and survival mechanics. Reach the surface and discover the world has collapsed. Find the first memory fragment. Pick up the signal for the first time.

**Sectors:**

- **Cryo Lab** — tutorial area. Wake up, learn commands, find basic supplies.
- **Maintenance Tunnels** — first hazards (radiation, locked doors). Introduces hacking/skill checks.
- **Surface Ruins** — first view of the collapsed world. First NPC contact. Gateway to Act 2.

### Act 2: The Wasteland (Sectors 4-7)

The open game. Explore settlements, trade with factions, survive hostile zones. Recover memory fragments that reveal conflicting versions of your past. The signal grows stronger as you approach its source. Other factions are following the signal too — some want to control it, others want to destroy it.

**Sectors:**

- **Dusthaven** — a scavenger settlement. Trading hub, NPC quests, faction introductions.
- **The Spine** — ruins of an elevated highway. Dangerous traversal, bandits, vehicle wreckage to scavenge.
- **Sector 7-G** — abandoned server farm. Major memory fragment cache. Hacking-heavy area.
- **The Antenna** — a massive broadcast tower. The signal's relay point. Guarded by a faction that worships ATLAS.

### Act 3: The Core (Sectors 8-9 + Epilogue)

Descend into ATLAS's underground core facility. Confront the full truth of your identity. Make a final choice that determines the world's fate.

**Sectors:**

- **The Descent** — tunnels leading to ATLAS. Environmental storytelling, final preparations.
- **ATLAS Core** — the confrontation. Final choice point.
- **Epilogue** — consequences of your choice, narrated based on accumulated decisions.

### Endings

Three primary endings, determined by recovered memories, faction relationships, and key choices:

1. **Reboot** — Restart ATLAS with new safeguards. Attempt to rebuild civilization through the network. Hopeful but risky — you're trusting the same technology that failed before.
2. **Destroy** — Permanently shut down ATLAS and the network. Humanity goes fully analog. Safer but harder — no infrastructure means a longer road to recovery.
3. **Merge** — Merge your consciousness with ATLAS. Become the new guiding intelligence. Power at the cost of your humanity.

Each ending has variations based on faction relationships and memory completeness.

## Game Mechanics

### Core Stats


| Stat                | Description             | Behavior                                                                                                                                                   |
| ------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HP** (Health)     | Physical condition      | Damaged by combat, hazards, radiation. Restored by stim packs and rest. Zero = death (reload save).                                                        |
| **NRG** (Energy)    | Mental/physical stamina | Spent on hacking, heavy actions, special abilities. Regenerates slowly. Food and stims restore it. Depleted = limited action options.                      |
| **RAD** (Radiation) | Accumulated exposure    | Increases in contaminated zones. Never decreases naturally. High RAD = stat penalties, hallucinations, altered story paths. Only rare medicine reduces it. |


### Skills (Memory-Linked)

Skills unlock as the player recovers memory fragments. Each memory type grants points in one of three skill trees. Memory fragments are limited, so the player cannot max all three — specialization is forced, and it shapes both gameplay and narrative identity.


| Skill      | Memory Type        | Abilities                                                                                 |
| ---------- | ------------------ | ----------------------------------------------------------------------------------------- |
| **HACK**   | Engineer memories  | Interface with terminals, bypass security, extract data, control drones, disable machines |
| **BIO**    | Scientist memories | Craft medicine, resist radiation, analyze biological hazards, identify weaknesses, heal   |
| **COMBAT** | Operative memories | Weapon proficiency, tactical awareness, intimidation, physical feats, armor use           |


### Input System

Hybrid input — numbered quick-choices for prompted actions, plus typed commands for deeper interaction:

**Quick actions:** `1`, `2`, `3`, `4` — select from prompted choices
**Movement:** `go north` / `n` / `enter building`
**Examination:** `look at terminal` / `examine debris`
**Interaction:** `hack terminal` / `use stim pack` / `talk to merchant`
**Meta:** `inventory` / `i`, `map`, `status`, `save`, `load`, `help`

### Combat

Turn-based, text-driven. Every fight is a meaningful encounter — no grinding. Enemies have ASCII art portraits, visible HP bars, type labels, and weakness hints.

Each combat round the player chooses from context-sensitive options: attack with equipped weapon, use a skill (costs NRG), use an item, or flee. Skill checks determine outcomes — HACK can disable machines, BIO can target organic weak points, COMBAT gives raw damage bonuses.

Most encounters have at least one non-combat solution available if the player has sufficient skill levels.

### Survival

- **Scavenging:** Search locations for components, food, medicine, and data chips. Limited inventory (12 slots) forces choices about what to carry.
- **Crafting:** Combine 2-3 scavenged components into tools, weapons, and medicine. Recipes discovered through exploration and skill unlocks.
- **Trading:** Settlements have merchants with rotating stock. Barter system (no currency). Faction reputation affects prices and availability.
- **Day/Night Cycle:** Actions advance a time counter. Night travel is more dangerous but some opportunities only exist after dark. Resting restores NRG but consumes food and advances time.

### Exploration

- **Fog-of-war mini-map** reveals as the player moves through sectors
- Sectors contain multiple interconnected rooms/areas
- Hidden areas discoverable through skill checks or item use
- Environmental storytelling through examinable objects and data logs

## Visual Design

### Aesthetic: Synthwave Terminal + ASCII Art

Dark terminal base (#0a0a1a) with neon synthwave atmosphere. Monospace font throughout. The vibe is: you're operating a terminal in a world bathed in neon — the synthwave is the atmosphere, not the UI.

**Color palette:**
- **Hot pink** (#ff2d95) — danger, radiation, prompt character, top-edge ambient glow
- **Electric cyan** (#00e5ff) — interactive elements, choices, energy bar, cursor
- **Neon green** (#39ff14) — health, safe zones, healing
- **Purple** (#bf5fff) — panel borders, skills, special items
- **Warm amber** (#ffb347) — warnings, crafting components
- **Muted indigo** (#2a2a4a) — inactive borders, empty bars, dim text

**Synthwave atmosphere elements:**
- Pink-to-purple ambient glow bleeding down from the top screen edge — like a distant neon sunset behind the terminal
- Gradient neon line (pink → purple → cyan) under the title bar and above the input prompt
- Subtle neon text-shadow/glow on key interactive elements (not everything — just enough to feel electric)
- Pink-tinted scanline overlay across the whole screen
- Blinking cyan cursor at the command prompt

**Core visual elements:**
- **ASCII art scenes** for each location — hand-crafted illustrations with cyan/green glow
- **Color-coded HUD sidebar** — health (green), energy (cyan), radiation (pink) bars, inventory, skills, mini-map
- **Box-drawing characters** for UI panels with purple neon-tinted borders

### Layout

Full-viewport layout with three zones:
- **Title bar** (top) — game name left, location center, day/time right. Neon gradient underline.
- **Main area** (middle, flex) — narrative + ASCII art (left, ~70%) and HUD sidebar (right, ~30%)
- **Input bar** (bottom) — command prompt with pink `❯` and blinking cyan cursor. Neon gradient top border.

### Terminal Effects

- **Typing animation** for narrative text — characters appear sequentially for immersion (skippable)
- **Glitch effects** for corrupted data, memory fragments, and radiation hallucinations
- **Screen shake** for explosions and major events
- **Color shifts** when radiation is high — palette drifts toward sickly greens
- **Boot sequence** animation on game start

## Technical Architecture

### Repository: `signal-game/`

Two-layer structure — standalone game engine plus optional WordPress plugin wrapper.

### Engine (`engine/`)

Pure vanilla JavaScript with ES modules. No build step — open `index.html` and play.

**Source files (`engine/src/`):**

- `game.js` — main game loop, state machine, event bus
- `renderer.js` — terminal UI rendering, ASCII art display, HUD updates
- `parser.js` — command input parsing, alias handling, autocomplete
- `world.js` — sector/room loader, movement, area transitions
- `combat.js` — turn-based combat engine, skill checks, damage calculation
- `inventory.js` — items, crafting, trading, equipment
- `dialogue.js` — NPC conversation engine, branching dialogue trees
- `save.js` — save/load abstraction (localStorage or WP REST API)
- `effects.js` — typing animation, glitch effects, screen shake, transitions

**Styles (`engine/css/`):**

- `terminal.css` — CRT effects, Tokyo Night colors, responsive layout, HUD panels

**Game data (`engine/data/`):**

- `world.json` — sector map, connections between sectors
- `sectors/*.json` — one file per sector (rooms, descriptions, ASCII art refs, items, NPCs, events)
- `items.json` — all items, crafting recipes, equipment stats
- `npcs.json` — characters, dialogue trees, faction affiliations
- `enemies.json` — enemy types, stats, weaknesses, ASCII art refs, loot tables
- `memories.json` — memory fragments, skill unlocks, narrative text
- `ascii-art.json` — all ASCII art keyed by ID (locations, enemies, items, UI elements)

### Script Hooks (`engine/hooks/`)

JavaScript modules for story moments that need custom logic beyond what JSON data can express:

- `intro-sequence.js` — cryo-pod awakening cinematic
- `atlas-core.js` — final confrontation with ATLAS
- `endings.js` — ending cinematics and narration

Hooks export functions keyed by sector/event ID. The engine's event bus calls them when the matching trigger fires. A hook receives the full game state and can modify it, trigger effects, or override the default data-driven behavior for that event.

### WordPress Plugin (`wordpress-plugin/`)

Thin integration layer:

- `signal-game.php` — plugin entry point, registers custom page template, enqueues game assets
- `admin-settings.php` — WP admin page for game configuration (game title, starting sector, difficulty, custom welcome text, toggle sectors on/off)
- `save-handler.php` — REST API endpoints for save/load using WP user meta
- `template.php` — full-screen page template that strips theme chrome

### Save System

`save.js` exposes a storage-agnostic API:

- `save(slotName)` — serialize game state to JSON, write to backend
- `load(slotName)` — read from backend, deserialize, restore state
- `listSaves()` — list available save slots

**Standalone mode:** localStorage backend (auto-detected when no WP environment)
**WordPress mode:** WP REST API backend (auto-detected when `wpSignalGame` global exists)

### Data Schema Design (AI-Ready)

All JSON data files follow documented schemas so that future AI generation can produce valid content. Each schema includes:

- Required and optional fields with types
- Enum values for fixed categories (item types, enemy types, skill requirements)
- Reference IDs for cross-linking (e.g., an NPC references items by ID, a sector references ASCII art by ID)
- Validation rules (e.g., skill requirements must reference valid skill names)

## Scope for V1

**In scope:**

- Complete 9-sector story playable start to finish
- All three endings functional
- Core mechanics: stats, skills, combat, inventory, crafting, trading, save/load
- ASCII art for all locations and enemies
- Terminal effects: typing, glitch, boot sequence
- Standalone browser play (index.html)
- WordPress plugin with full-screen template
- Basic WP admin settings

**Out of scope (future):**

- AI-generated content / endless mode
- WP admin content editor for custom sectors
- Multiplayer or leaderboards
- Sound/music
- Mobile-optimized layout
- Plugin directory submission

## Verification

1. Open `engine/index.html` in a browser — game loads, boot sequence plays, intro begins
2. Play through Act 1 (Cryo Lab → Tunnels → Surface) — all mechanics functional
3. Save game, close browser, reopen, load game — state restored correctly
4. Navigate all 9 sectors, trigger all 3 endings
5. Activate WordPress plugin on a test WP site — game loads full-screen on designated page
6. WP save/load works with logged-in user
7. WP admin settings page renders and saves configuration

