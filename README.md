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

## Play (Standalone)

No build step. No dependencies. Just a browser.

```bash
# Clone and serve
git clone https://github.com/travisw/signal-game.git
cd signal-game
./serve.sh

# Open http://localhost:8749/game.html
```

Or serve the `assets/` directory with any static file server and open `game.html`.

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
- Make choices that shape the story and determine your ending
- Multiple endings with variations based on your recovered memories and choices

## Tech

- **Vanilla JavaScript** — ES modules, no framework, no build step
- **Data-driven** — world, items, NPCs, enemies, and memories defined in JSON
- **Script hooks** — custom JS for cinematic moments (intro, endings)
- **Synthwave terminal UI** — Fira Code font, neon color palette, CRT scanlines, typing animations, glitch effects
- **Save system** — localStorage with WordPress REST API backend ready

## Structure

The repo IS a WordPress plugin. The game engine lives in `assets/`.

```
signal-game/
├── signal-game.php          # WP plugin entry point
├── includes/                # WP plugin PHP
│   ├── admin-settings.php   # Admin settings page
│   ├── save-handler.php     # REST API save/load
│   ├── ai-gateway.php       # AI content endpoint
│   ├── prompt-builder.php   # AI prompt assembly
│   ├── packet-validator.php # AI response validation
│   └── providers/           # AI provider adapters
│       ├── claude.php
│       ├── openai.php
│       └── custom.php
├── templates/
│   └── game.php             # Full-screen game template
├── assets/
│   ├── game.html            # Standalone entry point
│   ├── js/
│   │   ├── main.js          # Bootstrap
│   │   ├── game.js          # State machine, game loop
│   │   ├── renderer.js      # Terminal UI, HUD, ASCII art
│   │   ├── effects.js       # Typing, glitch, shake
│   │   ├── parser.js        # Command input parsing
│   │   ├── save.js          # Save/load abstraction
│   │   ├── ai-content.js    # AI content service
│   │   └── hooks/
│   │       └── endings.js   # Ending cinematics
│   ├── css/
│   │   └── terminal.css     # Synthwave terminal stylesheet
│   └── data/
│       ├── world.json       # Sector map and connections
│       ├── sectors/         # One JSON file per sector
│       ├── items.json       # Items, recipes, equipment
│       ├── npcs.json        # Characters and dialogue trees
│       ├── enemies.json     # Enemy types and stats
│       ├── memories.json    # Memory fragments and skill unlocks
│       ├── ascii-art.json   # All ASCII art by ID
│       └── easter-eggs.json
├── tests/                   # Test suite (75 tests)
├── docs/                    # Design specs and research
└── serve.sh                 # Standalone dev server
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

## WordPress Plugin

The game can run as a WordPress plugin with user-based saves and optional AI-generated content.

### Installation

1. Download the [latest release](https://github.com/travisw/signal-game/releases) as a ZIP file.
2. In your WordPress admin, go to **Plugins → Add New → Upload Plugin**.
3. Upload the ZIP file and click **Install Now**.
4. Activate the plugin.
5. Create a new **Page**, and in the page editor set the template to **SIGNAL Game (Full Screen)**.
6. Visit that page — the game loads full-screen, no theme chrome.

### Save/Load

When logged in to WordPress, saves are stored in your user account (instead of localStorage). The `save` and `load` commands work the same way.

### AI Content (Optional)

The plugin includes an AI gateway that generates varied room descriptions, NPC dialogue, and ambient events. To enable:

1. Go to **WP Admin → Settings → SIGNAL Game**.
2. Check **Enable AI Content**.
3. Choose a provider (Anthropic Claude, OpenAI, or a custom OpenAI-compatible endpoint).
4. Enter your API key.
5. Adjust temperature, rate limits, and model if desired.
6. Save.

How it works:
- Room descriptions render instantly from static content (zero lag).
- AI variants are pre-fetched in the background for connected rooms.
- By room 2-3, AI content is cached and ready — the player never waits.
- If AI is slow, down, or returns invalid content, the static description is used automatically.
- API keys stay server-side — the browser never sees them.

### Admin Settings

| Setting | Description |
|---------|-------------|
| Game Title | Displayed in the title bar (default: SIGNAL) |
| Starting Sector | Override the starting location (default: cryo-lab) |
| Difficulty | Easy / Normal / Hard |
| Welcome Text | Custom text shown during boot sequence |
| AI Enabled | Master toggle for AI content generation |
| AI Provider | Claude, OpenAI, or Custom endpoint |
| API Key | Your provider's API key (stored encrypted) |
| Model Override | Use a specific model instead of the default |
| Temperature | 0.0 (deterministic) to 1.0 (creative), default 0.7 |
| Rate Limit | Max AI requests per minute per session (default: 10) |

## Future

- AI-generated side sectors for endless replayability
- Entity memory for NPC continuity across AI-generated content
- Sound and music (synthwave ambient)
- Mobile-optimized layout

## License

MIT
