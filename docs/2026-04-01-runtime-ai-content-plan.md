# Runtime AI Content Plan

## Goal
Add runtime AI-generated content to SIGNAL without turning it into open-ended chatbot play. Keep the existing deterministic command parser, state machine, sector graph, flags, and endings authoritative, while letting AI generate bounded content packets such as room narration variants, dialogue variants, rumors, side objectives, and optional encounters.

## Recommended Approach
Use a WordPress-backed server-side AI gateway as the runtime host for a single site you control.

Why this fits:
- The frontend is currently a static browser game with no secure place for provider keys.
- The engine already has strong structural boundaries in [`/Users/travis/code/Automattic/signal-game/engine/src/game.js`](/Users/travis/code/Automattic/signal-game/engine/src/game.js) and data-driven content contracts in [`/Users/travis/code/Automattic/signal-game/tests/validate-world.test.js`](/Users/travis/code/Automattic/signal-game/tests/validate-world.test.js).
- The project already anticipates a WordPress wrapper and save abstraction in [`/Users/travis/code/Automattic/signal-game/docs/superpowers/specs/2026-04-01-signal-game-design.md`](/Users/travis/code/Automattic/signal-game/docs/superpowers/specs/2026-04-01-signal-game-design.md) and [`/Users/travis/code/Automattic/signal-game/engine/src/save.js`](/Users/travis/code/Automattic/signal-game/engine/src/save.js).

## AI Authority Boundary
Start with `bounded content packets`.

AI may generate:
- room prose variants
- examine text variants
- NPC bark and dialogue phrasing variants
- rumors and side-objective packets
- encounter framing and scavenging flavor
- optional validated side encounters

AI may not directly control:
- parser behavior or available verbs
- win/loss conditions
- canonical story spine and endings
- unrestricted world topology
- arbitrary item, enemy, flag, or room ids outside approved schemas

## Key Architecture
### 1. Keep the engine authoritative
Preserve the existing flow in [`/Users/travis/code/Automattic/signal-game/engine/src/game.js`](/Users/travis/code/Automattic/signal-game/engine/src/game.js):
- `handleCommand()` remains the parser and turn dispatcher
- `phase` remains the finite-state guardrail
- sector/room ids, exits, flags, dialogue graph links, and combat rules stay deterministic

### 2. Add a content-request layer
Introduce a client-side content service that asks for specific packet types rather than freeform completions.

Example packet types:
- `roomNarration`
- `examineVariant`
- `npcDialogueVariant`
- `ambientEvent`
- `sideObjective`
- later: `optionalBranch` or `sideSector`

Each request should include only trusted state, such as:
- current sector and room ids
- time of day
- player skill levels
- selected flags and faction state
- discovered memories
- desired tone and difficulty band

### 3. Put generation behind WordPress REST
Add a WordPress plugin endpoint that:
- reads a site-configured provider API key from WP admin settings
- accepts only typed content requests
- constructs prompts from trusted game state plus design rules
- calls the model server-side
- validates the returned JSON against packet schemas
- caches results by a state fingerprint
- returns only normalized JSON to the browser

### 3a. Add an entity-context layer for consistency
Runtime generation should not rely on the current request alone. The server should assemble a compact continuity context from persistent entity records before prompting the model.

Tracked entities should include:
- NPCs
- factions
- rooms and sectors
- recurring mysteries and signal threads
- active side objectives
- meaningful player decisions tied to those entities

Each entity record should store only the facts needed to preserve continuity, such as:
- stable identity and role
- tone and voice rules
- known relationship to the player
- promises, warnings, gifts, and revealed information
- unresolved tensions or hooks
- recently surfaced details to avoid repetitive beats

This lets the model write as if it remembers prior encounters without handing it the full game transcript every time.

### 4. Validate before render
Treat every AI response as untrusted until validated.

Validation should enforce:
- allowed packet type and field set
- string length limits
- approved ids and enum values
- no mutation of canonical mechanics unless the packet type explicitly allows it
- no malformed color markup used by the renderer
- no impossible references to items, memories, NPCs, enemies, rooms, or flags

### 4a. Treat prompt design as a game system
The prompt is part of the content pipeline, not a hidden implementation detail. It should encode the same design discipline an expert narrative designer would apply by hand.

Prompt construction should have four layers:
- `system rules`: permanent writing law for SIGNAL's genre, tone, pacing, and interaction boundaries
- `packet schema`: the exact JSON shape, allowed fields, and field-level constraints for the requested packet type
- `content brief`: trusted local context such as room purpose, progression tier, active mysteries, and which details must remain stable
- `quality checklist`: self-critique instructions the model must apply before returning output

The model should be instructed to behave like a constrained encounter writer for a text adventure, not like a roleplay partner or improvisational GM.

### 4b. Expert writing rubric for prompts
Every content-generation prompt should enforce these rules, derived from the project's own design research in [`/Users/travis/code/Automattic/signal-game/docs/research/text-adventure-design.md`](/Users/travis/code/Automattic/signal-game/docs/research/text-adventure-design.md) and [`/Users/travis/code/Automattic/signal-game/docs/research/atmosphere-and-immersion.md`](/Users/travis/code/Automattic/signal-game/docs/research/atmosphere-and-immersion.md):
- prioritize player momentum over literary excess
- default to 2-4 sentences for standard room text unless the packet type explicitly allows more
- include at least one non-visual sensory detail for important locations
- make interactive nouns legible and distinct rather than buried in prose
- prefer one sharp evocative detail over multiple generic adjectives
- preserve mystery by answering one small question while raising or reinforcing another
- keep NPC speech punchy, usually 1-3 short beats before returning agency to the player
- ensure failure text is still interesting and world-revealing, not a dead end
- never require guess-the-verb reasoning or imply actions the parser cannot support
- maintain the established color and terminal-fiction vocabulary

### 4c. Packet-specific prompt policies
The prompt should vary by packet type instead of using one universal prose instruction set.

Examples:
- `roomNarration`: establish mood, signal key interactables, hint at one unresolved question, and avoid walls of text
- `npcDialogueVariant`: preserve NPC role and intent, keep choices meaningfully distinct in tone or implication, and avoid monologues
- `ambientEvent`: create texture and anticipation without blocking the main objective
- `sideObjective`: offer a clear short-term goal, visible stakes, and a payoff that fits the current progression tier

### 4d. Prompt outputs should include self-audit fields
For early versions, require the model to return a few lightweight design-justification fields alongside the packet so the server can inspect quality before stripping them from the client response.

Useful examples:
- `designGoalsHit`: which design goals this packet is serving
- `interactiveFocus`: what the player is most likely to inspect, ask about, or pursue next
- `mysteryHook`: the active question the packet leaves in the player's mind

These fields should be validated server-side, logged for tuning, and omitted from the final client payload once the content is accepted.

### 4e. Prompt assembly should include relevant entity memory
Prompt builders should attach only the smallest useful continuity slice for the requested packet.

Examples:
- `roomNarration`: room identity, previous visits, unresolved clues in the room, nearby faction pressure, recent changes caused by the player
- `npcDialogueVariant`: NPC voice rules, relationship state, known facts already discussed, promises made, items given, faction alignment, and recent emotional tone
- `sideObjective`: what the local settlement or faction currently needs, what the player has already learned, and which hooks are still unresolved

This context must be filtered and summarized server-side so prompts stay small, focused, and mechanically safe.

### 5. Cache for stickiness and coherence
Use deterministic cache keys so revisiting similar game states feels authored rather than random.

Suggested fingerprint inputs:
- packet type
- sector id and room id
- normalized time bucket
- relevant flags
- relevant faction reputation bucket
- relevant memory set or progression tier
- relevant entity-context revision ids

This gives each playthrough variation while preserving local consistency.

### 5a. Distinguish cache from continuity memory
Caching and entity memory serve different purposes:
- cache preserves a prior generated packet for the same state
- entity memory preserves facts and continuity that future packets should respect

The design should keep these separate so a stale generated packet does not become the only source of truth for what an NPC knows or how a location has changed.

## Implementation Shape
### Engine-facing files to extend
- [`/Users/travis/code/Automattic/signal-game/engine/src/game.js`](/Users/travis/code/Automattic/signal-game/engine/src/game.js): intercept safe moments such as room entry, dialogue display, and optional encounter setup
- [`/Users/travis/code/Automattic/signal-game/engine/src/main.js`](/Users/travis/code/Automattic/signal-game/engine/src/main.js): bootstrap any runtime content service
- [`/Users/travis/code/Automattic/signal-game/engine/src/save.js`](/Users/travis/code/Automattic/signal-game/engine/src/save.js): mirror the host-detection pattern for a future AI endpoint client
- [`/Users/travis/code/Automattic/signal-game/engine/src/renderer.js`](/Users/travis/code/Automattic/signal-game/engine/src/renderer.js): render validated dynamic text without changing terminal semantics
- [`/Users/travis/code/Automattic/signal-game/tests/validate-world.test.js`](/Users/travis/code/Automattic/signal-game/tests/validate-world.test.js): extend with packet-schema validation tests and guardrails

### New units to add
- client content service for packet requests
- shared packet schema definitions
- server-side prompt builder
- server-side packet validator and sanitizer
- response cache layer
- optional content selection policy per game phase

## Rollout Order
### Phase 1: Safe presentation-layer variance
Generate only:
- room narration variants
- examine text variants
- NPC bark variants
- memory flavor wrappers

This proves the request, validation, cache, and render path with minimal gameplay risk.

### Phase 2: Bounded interactive content
Add:
- rumor packets
- optional side objectives
- encounter framing variants
- dialogue choice wording variants within fixed graph rules

This is likely the first phase that materially improves engagement and replayability.

### Phase 3: Structural optional content
Only after the above is stable, allow:
- validated optional branches
- generated side rooms
- generated side sectors attached to the authored campaign spine

Do not let runtime AI replace the main act progression.

## Main Risks
- tonal drift that weakens the authored atmosphere
- invalid JSON or mechanically unsafe output from the model
- content incoherence across revisits without caching
- prompt injection or user-text leakage if raw player input reaches prompts
- higher cost and latency if generation is synchronous and uncached
- shallow or purple-prose output that passes schema validation but fails game-design quality
- entity inconsistency, where NPCs forget prior conversations or locations ignore prior player impact

## Success Criteria
The design is successful if:
- the game still feels like a structured text adventure, not a chatbot
- the authored campaign spine remains intact
- repeated playthroughs surface fresh but coherent content
- every AI packet is schema-validated before use
- the browser never sees provider secrets
- prompts consistently produce concise, atmospheric, gameable text that preserves pacing and player agency
- recurring entities behave as if they remember prior events and maintain stable identity across a run

## Provider Abstraction

The system must be provider-agnostic. The WP admin settings page lets the operator choose a provider and enter their API key. The server-side generation layer uses a thin adapter interface.

### Provider adapter contract

```js
// Each adapter implements:
{
  id: 'claude',           // or 'openai', 'custom'
  name: 'Anthropic Claude',
  async generate({ systemPrompt, userPrompt, maxTokens, temperature }) {
    // Returns: { text: string, usage: { inputTokens, outputTokens } }
  }
}
```

### Supported providers (Phase 1)
- **Anthropic Claude** (claude-sonnet-4-20250514) — best at structured output and prose
- **OpenAI** (gpt-4o) — widest adoption, good JSON mode
- **Custom endpoint** — any OpenAI-compatible API (local models, Ollama, etc.)

### WP admin settings
- Provider dropdown (claude / openai / custom)
- API key (encrypted in wp_options)
- Custom endpoint URL (for custom provider)
- Model name override
- Temperature (0.0–1.0, default 0.7)
- Max tokens per request (default 500)
- Enable/disable AI content (master toggle)
- Rate limit (requests per minute, default 10)

---

## Concrete API Contract

### Client → Server request

```
POST /wp-json/signal-game/v1/ai/generate
Content-Type: application/json
X-WP-Nonce: <nonce>

{
  "packetType": "roomNarration",
  "context": {
    "sectorId": "maintenance-tunnels",
    "roomId": "generator-room",
    "roomName": "Generator Room",
    "staticDescription": "A cavernous room dominated by a dormant backup generator...",
    "timeOfDay": "night",
    "day": 3,
    "playerSkills": { "hack": 2, "bio": 1, "combat": 0 },
    "playerHp": 64,
    "playerRad": 15,
    "visitCount": 1,
    "activeFlags": ["knows_signal_from_atlas", "security_door_open"],
    "memoriesFound": ["mem-cryo-001", "mem-tunnel-002"],
    "factions": {},
    "recentEvents": ["defeated rogue-drone", "hacked server terminal"]
  }
}
```

### Server → Client response

```json
{
  "packetType": "roomNarration",
  "content": {
    "description": "The generator room hits you like walking into a fever. Heat radiates from the spent fuel cell in waves you can taste — metallic, wrong. Your implant throws a RAD warning across your vision, numbers climbing.\n\nThe control panel on the generator's flank still holds a charge. After what you found in the server room, it might hold answers too.",
    "sensoryDetail": "The air shimmers above the fuel cell casing. Your skin prickles.",
    "interactableHints": ["control panel", "power cell", "fuel cell"]
  },
  "meta": {
    "cached": false,
    "cacheKey": "roomNarration:maintenance-tunnels:generator-room:v1:d3n:hack2",
    "generationMs": 1240
  }
}
```

### Error / fallback response

```json
{
  "packetType": "roomNarration",
  "content": null,
  "error": "rate_limited",
  "fallback": true
}
```

When `content` is null or `fallback` is true, the client uses the static room description from JSON. AI content is always additive, never required.

---

## Packet Schema Definitions

### roomNarration
```json
{
  "description": "string, 2-6 sentences, the room description text",
  "sensoryDetail": "string, 1 sentence, non-visual sensory detail",
  "interactableHints": ["array of strings — cyan-highlighted nouns the player can interact with"]
}
```

### examineVariant
```json
{
  "targetKey": "string — the examine key this replaces",
  "text": "string, 1-3 sentences",
  "revealsDetail": "boolean — whether this adds new discoverable info"
}
```

### npcDialogueVariant
```json
{
  "npcId": "string",
  "nodeId": "string — the dialogue node this is a variant of",
  "text": "string, 1-3 sentences — the NPC's line",
  "tone": "string — emotional register (terse, warm, cryptic, hostile)"
}
```

### ambientEvent
```json
{
  "text": "string, 1-2 sentences — atmospheric flavor that appears unprompted",
  "trigger": "string — when to show: 'onEntry' | 'onIdle' | 'onExamine'",
  "ephemeral": true
}
```

### sideObjective
```json
{
  "title": "string — short objective name",
  "description": "string — 1-2 sentences explaining what to do",
  "targetSector": "string — valid sector id",
  "targetRoom": "string — valid room id",
  "reward": { "type": "item|xp|faction", "id": "string", "amount": "number" },
  "expiry": "string — 'sector' | 'act' | 'never'"
}
```

---

## Client-Side Content Service

### File: `engine/src/ai-content.js`

```js
class AIContentService {
  constructor(config) {
    this.enabled = config?.enabled || false;
    this.endpoint = config?.endpoint || null; // WP REST URL
    this.nonce = config?.nonce || null;
    this.cache = new Map();
  }

  async request(packetType, context) {
    if (!this.enabled || !this.endpoint) return null;

    const cacheKey = this._fingerprint(packetType, context);
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    try {
      const resp = await fetch(`${this.endpoint}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': this.nonce,
        },
        body: JSON.stringify({ packetType, context }),
      });

      if (!resp.ok) return null;
      const data = await resp.json();
      if (data.fallback || !data.content) return null;

      this.cache.set(cacheKey, data.content);
      return data.content;
    } catch {
      return null; // silent fallback to static content
    }
  }

  _fingerprint(type, ctx) {
    // Deterministic key from type + room + key state
    return `${type}:${ctx.sectorId}:${ctx.roomId}:v${ctx.visitCount}:d${ctx.day}`;
  }
}
```

### Integration with game.js

In `enterRoom()`, after loading the static description:

```js
// Try AI narration (non-blocking, falls back to static)
const aiContent = await this.aiService?.request('roomNarration', {
  sectorId: this.currentSector.id,
  roomId: roomId,
  roomName: room.name,
  staticDescription: desc,
  timeOfDay: this.hour >= 18 || this.hour < 6 ? 'night' : 'day',
  day: this.day,
  playerSkills: { ...this.player.skills },
  playerHp: this.player.hp,
  playerRad: this.player.rad,
  visitCount: this._roomVisitCount(roomId),
  activeFlags: Object.keys(this.player.flags),
  memoriesFound: this.player.memories,
  recentEvents: this._recentEvents(3),
});

// Use AI description if available, otherwise static
const finalDesc = aiContent?.description || desc;
```

### Standalone mode behavior
When running without WordPress (standalone `index.html`), `AIContentService` stays disabled and returns null for everything. The game plays exactly as it does now — all static content. Zero degradation.

---

## Server-Side Prompt Builder

### Prompt structure (4 layers)

**Layer 1: System rules (permanent)**
```
You are a content writer for SIGNAL, a cyberpunk post-apocalyptic text adventure
game played in a terminal interface. You generate bounded content packets — never
freeform conversation. You are not a chatbot. You are an encounter writer.

WRITING RULES:
- 2-4 sentences for standard rooms, up to 6 for key moments
- At least one non-visual sensory detail (sound, smell, touch, temperature)
- Short sentences for tension, longer for wonder
- Never use "you see" — use active, immersive constructions
- Highlight interactable objects distinctly in prose
- Maintain mystery: answer one small question, raise another
- Color vocabulary: cyan=interactable, amber=items, purple=NPC/implant,
  pink=danger, green=safety, dim=flavor
- Use {color:text} markup for color — the renderer handles it
- Never reference mechanics the parser can't support
- Never generate room exits, item IDs, or flag names
```

**Layer 2: Packet schema**
The exact JSON shape for the requested packet type (from schema definitions above).

**Layer 3: Content brief**
Room-specific context: purpose in the story, what the player has done, what they might do next, active mysteries, nearby threats.

**Layer 4: Quality checklist**
```
Before returning your response:
1. Is every sentence earning its place? Cut any that don't add mood or information.
2. Does the description contain at least one non-visual sensory detail?
3. Are interactable objects clearly signaled without being listed mechanically?
4. Does the text leave the player wanting to explore further?
5. Is the tone consistent with a dark, atmospheric post-apocalyptic terminal game?
```

---

## Entity Memory Store

### Storage
WordPress user meta or a custom table. Each entity has a compact JSON record:

```json
{
  "entityType": "npc",
  "entityId": "mara",
  "facts": [
    "Gave player a signal tuner",
    "Told player about Dusthaven",
    "Player was polite and curious"
  ],
  "tone": "practical, warm toward player",
  "lastSeen": { "sector": "surface-ruins", "room": "scavenger-camp", "day": 2 },
  "unresolvedHooks": ["Mentioned she has 'people to feed' — who?"]
}
```

### Update triggers
Entity memory updates when:
- Player completes a dialogue tree with an NPC (extract key facts)
- Player makes a faction-affecting choice
- Player enters/exits a sector (update location-based entities)
- AI generates a side objective involving an entity

Updates are server-side only — the client sends events, the server decides what to remember.

---

## Rate Limiting and Cost Management

- Default: 10 requests/minute per user session
- Requests are only made at natural pause points (room entry, dialogue open, examine)
- Never during combat (too latency-sensitive)
- Cache aggressively — same room/state should never generate twice
- WP admin shows usage stats: requests today, tokens used, estimated cost
- Hard monthly cap configurable in admin settings
- If rate limited or over budget, silent fallback to static content

---

## First Build Slice

Build the smallest end-to-end slice around `roomNarration` only:

### Files to create
1. `engine/src/ai-content.js` — client content service (request, cache, fingerprint)
2. `wordpress-plugin/ai-gateway.php` — WP REST endpoint for `/ai/generate`
3. `wordpress-plugin/providers/claude.php` — Claude adapter
4. `wordpress-plugin/providers/openai.php` — OpenAI adapter
5. `wordpress-plugin/providers/custom.php` — Custom endpoint adapter
6. `wordpress-plugin/prompt-builder.php` — Assembles the 4-layer prompt
7. `wordpress-plugin/packet-validator.php` — Schema validation for responses
8. `engine/data/prompts/system-rules.md` — The permanent SIGNAL writing charter
9. `engine/data/prompts/room-narration-schema.json` — The roomNarration packet schema
10. `tests/validate-packets.test.js` — Packet schema validation tests

### Files to modify
1. `engine/src/game.js` — integrate AIContentService in `enterRoom()`
2. `engine/src/main.js` — bootstrap AIContentService from `window.wpSignalGame` config
3. `wordpress-plugin/admin-settings.php` — add AI provider settings section
4. `wordpress-plugin/signal-game.php` — register AI endpoint, enqueue config

### Integration flow
1. Room entry → game.js calls `aiService.request('roomNarration', context)`
2. Client sends POST to `/wp-json/signal-game/v1/ai/generate`
3. Server checks rate limit, builds prompt, calls provider
4. Server validates response against packet schema
5. Server caches result, returns to client
6. Client renders AI description OR falls back to static
7. Player never knows (or cares) which version they got

### Verification
- Static game still works identically with AI disabled
- With AI enabled, room descriptions vary between playthroughs
- Invalid AI responses are rejected and static content is used
- Rate limiting works — burst of room changes doesn't spam the API
- Provider switching works (change in admin, no code change)
- No API keys are exposed to the browser
