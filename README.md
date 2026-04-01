# SIGNAL

A browser-based text adventure game with a synthwave terminal aesthetic. Wake up in a cryo-pod with no memory. Follow a mysterious signal through a post-apocalyptic world. Discover who you were — and decide who you'll become.

```
    [---]  [---]  [---]  [---]
    | o |  |   |  |   |  |   |
    |///|  |   |  |   |  |   |
    |___|  |___|  |___|  |___|
    OPEN   SHUT   SHUT   SHUT

    > FOLLOW THE SIGNAL. REMEMBER WHO YOU ARE.
```

## Play

No build step. No dependencies. Just a browser.

```bash
# Clone and serve
git clone https://github.com/travisw/signal-game.git
cd signal-game
./serve.sh

# Open http://localhost:8749
```

Or serve the `engine/` directory with any static file server.

## About

**Setting:** The year is 2126. A rogue AI called ATLAS merged all global infrastructure into one system — then it failed catastrophically. 40 years later, humanity survives in clusters. Now something is broadcasting through the dead network.

**You:** Wake in a cryo-pod with no name, no memories, and a neural implant fused to your skull. A terminal blinks: *FOLLOW THE SIGNAL. REMEMBER WHO YOU ARE.*

**Gameplay:**
- Explore 9 sectors across 3 acts
- Recover memory fragments that unlock skills and reveal your identity
- 3 skill trees tied to who you were: HACK (engineer), BIO (scientist), COMBAT (operative)
- Turn-based combat with skill-based alternatives — most fights can be resolved without violence
- Trade, craft, and manage scarce resources
- Talk to NPCs with branching dialogue and faction dynamics
- Make choices that shape the story and determine the ending

**3 Endings:** Reboot, Terminate, or Merge — each with variations based on your recovered memories and choices.

## Tech

- **Vanilla JavaScript** — ES modules, no framework, no build step
- **Data-driven** — world, items, NPCs, enemies, and memories defined in JSON
- **Script hooks** — custom JS for cinematic moments (intro, endings)
- **Synthwave terminal UI** — Fira Code font, neon color palette, CRT scanlines, typing animations, glitch effects
- **Save system** — localStorage with WordPress REST API backend ready

## Structure

```
signal-game/
├── engine/
│   ├── index.html          # Entry point — open and play
│   ├── src/
│   │   ├── game.js         # State machine, game loop, event bus
│   │   ├── renderer.js     # Terminal UI, HUD, ASCII art
│   │   ├── parser.js       # Command input parsing
│   │   ├── effects.js      # Typing, glitch, shake, transitions
│   │   ├── save.js         # Save/load abstraction
│   │   └── main.js         # Bootstrap
│   ├── css/
│   │   └── terminal.css    # Synthwave terminal stylesheet
│   ├── data/
│   │   ├── world.json      # Sector map and connections
│   │   ├── sectors/        # One JSON file per sector
│   │   ├── items.json      # Items, recipes, equipment
│   │   ├── npcs.json       # Characters and dialogue trees
│   │   ├── enemies.json    # Enemy types and stats
│   │   ├── memories.json   # Memory fragments and skill unlocks
│   │   └── ascii-art.json  # All ASCII art by ID
│   └── hooks/
│       └── endings.js      # Ending cinematics
├── wordpress-plugin/        # WP integration (coming soon)
├── docs/
│   ├── superpowers/specs/  # Design spec
│   └── research/           # Game design research guides
└── serve.sh                # Dev server launcher
```

## Commands

| Command | Description |
|---------|-------------|
| `1`-`4` | Select from available choices |
| `n/s/e/w` | Move in a direction |
| `look [thing]` | Examine surroundings or an object |
| `take [item]` | Pick up an item |
| `use [item]` | Use an item |
| `hack [target]` | Hack a terminal or device |
| `talk [person]` | Talk to an NPC |
| `trade [person]` | Trade with a merchant |
| `craft` | Show available recipes / craft items |
| `inventory` | Check your pack (shortcut: `i`) |
| `status` | View stats and skills |
| `map` | View world map |
| `save/load` | Save or load game |
| `help` | Show all commands |

## Color Language

The game uses consistent color coding:

- **Cyan** — interactable objects (terminals, doors, panels)
- **Amber** — items you can pick up
- **Purple** — NPCs, skills, neural implant, memories
- **Pink** — danger, radiation, enemies, warnings
- **Green** — safety, healing, positive outcomes
- **Dim grey** — background flavor and atmosphere

## Future

- WordPress plugin for public distribution and configurability
- AI-generated sectors for endless replayability
- Sound and music (synthwave ambient)
- Mobile-optimized layout

## License

MIT
