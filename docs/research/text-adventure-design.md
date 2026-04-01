# Text Adventure & Interactive Fiction Design Guide

A practical reference for designing text-based adventure games. Compiled from GDC talks, postmortems, design articles, and lessons from landmark games including Zork, Anchorhead, 80 Days, A Dark Room, Sorcery!, and Disco Elysium.

---

## Table of Contents

1. [Text Adventure UI/UX Best Practices](#1-text-adventure-uiux-best-practices)
2. [Narrative Design & Story Structure](#2-narrative-design--story-structure)
3. [Color and Visual Language](#3-color-and-visual-language)
4. [Pacing and Flow](#4-pacing-and-flow)
5. [Player Onboarding](#5-player-onboarding)
6. [Common Pitfalls](#6-common-pitfalls)
7. [Sources](#7-sources)

---

## 1. Text Adventure UI/UX Best Practices

### Readability First

- **Font choice matters.** In a game that is entirely text, the font IS the graphics engine. Use monospace or highly legible fonts. Size should err on the larger side — players will be reading for long stretches.
- **Contrast is non-negotiable.** Light text on dark background (or vice versa) with sufficient contrast ratio. Avoid low-contrast "aesthetic" color schemes that sacrifice readability.
- **Line length should be 50-75 characters.** This is the typographic sweet spot for comfortable reading. Don't let text span the full width of a wide terminal window. Center or constrain the text column.
- **Use generous line spacing.** Dense text blocks are exhausting. Add breathing room between paragraphs and after important information.

### Information Hierarchy

- **Not all text is equal.** Room descriptions, dialogue, system messages, and player input should be visually distinct from each other. Use color, indentation, symbols, or whitespace to separate them.
- **Separate narration from mechanics.** Story text and system feedback (damage numbers, inventory changes, status updates) should look different so players can process them independently.
- **Important information should stand out.** Items the player can interact with, exits, character names, and key story terms can be highlighted. But be consistent — if you highlight interactable nouns, highlight ALL interactable nouns, always.
- **Roguelike UI lessons apply.** Cogmind (ASCII roguelike) demonstrates that terminal-based games can be both highly legible and aesthetically pleasing. The key is unified visual design — interface, content, and art should feel like one coherent system.

### Layout and Structure

- **Use whitespace as a design tool.** Empty lines between sections create visual breathing room and help players parse information. A blank line is worth more than a divider character.
- **Dividers and borders.** Simple horizontal rules (`---`, `===`, or box-drawing characters) can separate sections clearly. But don't overdo it — too many borders create visual noise.
- **Consistent structure for recurring elements.** If combat always shows HP, then options, then a prompt — keep that layout identical every time. Players should never have to hunt for information they know exists.
- **Keep the prompt area clean.** The input area should be unambiguous. Players should always know when the game is waiting for their input, what kind of input is expected, and where to type it.

### Accessibility

- **Never rely on color alone** to convey meaning. Always pair color with another indicator (symbol, label, position, text style). Colorblind players exist.
- **Allow text speed customization.** If you use typing effects, let players set speed to instant. Fast readers should not be held hostage by animations.
- **Screen reader compatibility.** If building for terminals, ensure ANSI codes degrade gracefully. If building for web, use semantic HTML.

---

## 2. Narrative Design & Story Structure

### Structural Patterns for Choice-Based Games

These are the foundational architectures, catalogued by Sam Kabo Ashwell and expanded by Emily Short. Know them and pick deliberately.

**Time Cave** — Heavily branching, no re-merging. Every choice leads to a unique path. Content explodes exponentially. Only works for very short games (3-4 decisions per path max). Example: early Choose Your Own Adventure books.

**Gauntlet** — A linear central thread with branches that end in death, failure, or quick rejoining. Two varieties:
- *Deadly gauntlet*: Branches prune via failure (classic Sierra games). Frustrating if deaths are unfair.
- *Friendly gauntlet*: Branches rejoin quickly, giving flavor but not divergence.

**Branch and Bottleneck** — The most common and practical structure. The story branches at decision points but regularly reconverges at key plot events. Requires state-tracking to acknowledge past choices at bottleneck points. This is what most successful commercial IF uses, including 80 Days and Sorcery!.

**Sorting Hat** — Early game branches heavily to determine which major path the player follows. Once sorted, paths are relatively linear. Good for replayability.

**Hub and Spoke** — A central location or state that the player returns to between excursions. Each spoke is a self-contained adventure or episode. A Dark Room uses a variant of this — the room is the hub, and the wider world opens up as spokes.

**Quality-Based / Storylet Systems** — Pioneered by Failbetter Games (Fallen London) and theorized by Emily Short. Instead of a fixed tree, the game has a pool of small story fragments ("storylets") that become available based on the player's current qualities/stats/state. The system surfaces the most relevant content dynamically. Extremely powerful for long-form games, but harder to write because you lose direct control of sequence.

### Making Choices Feel Meaningful

**The inkle approach (80 Days, Sorcery!):**
- Choices should be interesting IN THEMSELVES, not just as levers. "Delhi or Moscow?" is inherently flavorful — the player imagines both before choosing.
- Show the player that choices matter through UI feedback. After realizing players felt their choices "didn't affect anything" in Frankenstein, inkle added visible systems (the map, the clock, the money) so players could SEE consequences.
- Use "delayed branching" — early choices seem minor but affect outcomes much later. This creates the illusion of enormous branching with manageable content.
- Acknowledge choices. Reference previous decisions in later text so players know the game remembers.

**The Disco Elysium approach:**
- Skills as internal voices. Disco Elysium's 24 skills aren't just numbers — they're characters that speak to the player, argue with each other, and offer (sometimes terrible) advice. This turns stat checks into narrative moments.
- Two types of skill checks serve different purposes:
  - *Red checks*: One chance, can't retry, consequences either way. Creates permanent weight.
  - *White checks*: Can retry after meeting conditions. Creates goals and motivation.
- *Passive checks* appear automatically during dialogue based on your stats, providing flavor text or unlocking options. This makes character builds feel constantly relevant.
- **Failure is content, not punishment.** Failed skill checks give you dialogue options and narrative moments that are often MORE interesting than success. This is a critical lesson: if failure is just "nothing happens," players save-scum. If failure is a different kind of story, players accept it.

**General principles for meaningful choices:**
- Avoid the "illusion of choice" — if two options always lead to the same scene, players feel cheated. Even small variations (different dialogue, minor scene changes) signal that the choice registered.
- Choices work best when they reflect character personality, not just tactical optimization. "Are you kind or ruthless?" is more engaging than "pick the option with the best stat bonus."
- Momentum matters. A consequence necessarily occurs later in time than its cause. If the gap is too long, the connection feels weak. If it's too short, it feels mechanical.
- Maintain consistency. Never reference events the player might not have experienced. Track state carefully.

### Story Techniques from Landmark Games

**Zork** — Personality in responses. "Only Santa Claus climbs down chimneys" is infinitely better than "You can't do that." Every response, even failure, is a chance to build world and character. The thief NPC who roams the game and steals your items creates organic tension from a simple system.

**Anchorhead** — Atmosphere through exhaustive implementation. Examine any noun in a room description and you get a sensible, atmospheric reply. Attempt a puzzle in a sensible way and you either solve it or get a meaningful hint. Atmosphere comes not from purple prose but from the feeling that the world is REAL — that everything responds to your attention.

**A Dark Room** — Story through environment, not exposition. The game tells its narrative entirely through environmental cues. No cutscenes, no dialogue dumps. The player pieces together what happened through what they find, what they build, and what attacks them. Spare, clipped sentences inspired by Cormac McCarthy's "The Road."

**80 Days** — Geography as narrative structure. By tying choices to physical locations on a map, every decision is automatically loaded with context and consequence. The constraint of the clock (80 days) creates natural urgency without arbitrary timers.

---

## 3. Color and Visual Language

### Establishing a Color Vocabulary

The goal is to create a consistent "visual language" that players internalize unconsciously. Color should MEAN something, and that meaning should be stable.

**Recommended color assignments (adapt to your game):**

| Color | Use For | Rationale |
|-------|---------|-----------|
| White/Default | Narration and descriptions | Baseline — the "voice" of the game |
| Bright/Bold White | Emphasis within narration | Draws eye without breaking voice |
| Cyan/Blue | Interactive elements, commands, exits | Cool colors suggest "available actions" |
| Yellow/Gold | Important items, key information, warnings | Universal "pay attention" color |
| Green | Success, positive outcomes, healing | Universally positive association |
| Red | Danger, damage, critical warnings | Universal danger signal |
| Magenta/Purple | Mysterious, magical, or unusual elements | Suggests the uncanny |
| Dim/Gray | System messages, flavor text, less important info | Recedes visually, creates hierarchy |

**Rules for color use:**

1. **Be consistent.** If cyan means "you can interact with this," it ALWAYS means that. Never use cyan for decoration. Players will try to interact with it.
2. **Be sparing.** If everything is colored, nothing stands out. Color should highlight 10-20% of text at most. The default color carries the narrative.
3. **Never use color as the ONLY signal.** Pair with symbols, formatting, or position. Example: `[!] Warning` in red is better than just red text.
4. **Avoid green/red for right/wrong choices.** Players instinctively read green as "correct" and red as "incorrect." If you're offering genuine choices, use neutral colors for all options.
5. **Use color to convey emotion in dialogue sparingly.** Red for anger, purple for confusion, etc. can work as a system, but only if explicitly taught and used consistently. Otherwise it feels arbitrary.
6. **Dim/gray for de-emphasis is powerful.** Graying out already-seen information, system messages, or less critical flavor text naturally draws the eye to what matters.
7. **Limit yourself to 4-5 semantic colors maximum.** More than that and players can't internalize the vocabulary. A focused palette reads as intentional design; a rainbow reads as chaos.

### Symbols and Formatting as Language

Beyond color, you have other visual tools:

- **Bold** — Use for first introduction of important terms, names, or items. Once introduced, revert to normal weight.
- **Brackets and markers** — `[>]` for choices, `(!)` for alerts, `*` for items. Create a small, consistent symbol vocabulary.
- **Indentation** — Indent dialogue, choices, or sub-information. This creates visual nesting that helps players parse structure.
- **Box-drawing characters** — `┌─┐│└─┘` can frame status panels, inventory, or maps. Separates "game state" from "narrative" cleanly.
- **Whitespace and blank lines** — The most underrated formatting tool. A blank line before a choice list. Two blank lines before a new scene. Consistent spacing teaches rhythm.

### Teaching the Visual Vocabulary

Players learn your color/symbol language through consistent use, not through a legend or tutorial. The first few encounters should pair the visual treatment with unambiguous context:

- First time the player sees a highlighted item: "You notice a `[rusty key]` on the table." — The brackets and color, combined with the word "notice," teach the player that this formatting means "interactable."
- First time the player sees red text: pair it with an obviously dangerous context. The association forms naturally.
- If your system is complex, a brief "help" command that explains the visual language is fine as a reference — but don't front-load it.

---

## 4. Pacing and Flow

### Description Length

**Room/scene descriptions: 2-4 sentences for standard locations.** This is enough to establish mood, mention key features, and list exits without overwhelming. Save longer descriptions (5-8 sentences) for important story locations, first-time encounters, and dramatic reveals.

**The Anchorhead principle:** The initial room description should be concise, but EXAMINING things should reveal detail. This puts pacing control in the player's hands — curious players can drill deep, impatient players can move on.

**Avoid "wall of text" at all costs.** If you must deliver a long passage (cutscene, letter, backstory), break it into chunks with player interaction between them (even if it's just "press enter to continue"). Studies of reading behavior show engagement drops sharply after ~150 words of unbroken text.

**Re-entering a room:** Show a shortened version of the description. The player already knows the basic layout. Highlight only what has CHANGED. This rewards attentiveness and keeps the pace up.

### Typing Animations and Text Display

**When to use typing/typewriter effects:**
- Title screens and dramatic single-line reveals
- Character dialogue where speech pacing conveys emotion (Ace Attorney uses variable speed to show how quickly or slowly a character talks)
- A single key line for dramatic tension — the slow reveal of an important word or phrase
- Radio transmissions, computer terminals, or other diegetic "typed" communication

**When NOT to use typing effects:**
- Room descriptions and general narration (too slow, players will resent it)
- Long passages of any kind
- System messages (inventory, status, help)
- Any text the player might see repeatedly

**Always provide a way to skip or speed up animations.** Every game should let players set text speed to instant. Animated text puts the game in control of pacing instead of the player, which can feel adversarial for fast readers. A good compromise: animate on first display, instant on repeat.

**Gradual text display can help accessibility.** For players with dyslexia, character-by-character display prevents the problem of losing their place as new text appears. But this should be opt-in, not forced.

### Balancing Game Phases

A text adventure typically cycles between several modes. Variety prevents monotony.

**Exploration** — The core loop of most text adventures. Moving through spaces, examining things, building a mental map. Keep this active — every room should offer something to discover, even if it's just atmosphere.

**Dialogue** — Conversations with NPCs. Keep exchanges punchy. 2-3 sentences per NPC speech, then give the player a choice or action. Long monologues kill engagement. Disco Elysium's genius is that your own SKILLS talk to you — the internal monologue IS the dialogue system.

**Puzzle-solving** — The player has a goal and is figuring out how to achieve it. This is where pacing naturally slows and that's fine — the player is in control. But provide enough feedback that they know they're making progress (or at least not wasting time).

**Combat/Conflict** — If your game has it, keep rounds short and choices clear. Resource management creates tension: stamina, health, limited-use items, positioning. Every combat choice should feel like a trade-off, not a math problem.

**Quiet moments** — Deliberately slower scenes where the player can reflect, explore without pressure, or absorb story. These are essential after tense sequences. The campfire after the dungeon. The morning after the storm. Don't rush players through these.

**The A Dark Room model for pacing:**
A Dark Room is a masterclass in pacing through progressive disclosure. The game begins with a single action (light a fire) and unfolds new mechanics exactly when the player thinks they've seen everything. Each new system (resource gathering, village management, exploration, combat) arrives as a surprise that recontextualizes what came before. The pacing principle: reveal new layers just as the current layer starts to feel routine.

### Scene Transitions

- **Mark transitions clearly.** A new scene or location should be visually distinct from what came before — extra whitespace, a divider, a location header. The player should never be confused about whether they've moved.
- **Vary the rhythm.** Alternate between short, punchy scenes and longer, more contemplative ones. If the last three rooms had 2-sentence descriptions, maybe the next one deserves 5 sentences. Rhythm is about contrast.
- **End scenes on hooks.** Leave a question unanswered, a door unopened, a sound unexplained. This pulls the player forward.

---

## 5. Player Onboarding

### The Cardinal Rule: Teach Through Play, Not Manuals

The worst thing a text adventure can do is open with a wall of instructions explaining every command, every color, every system. Players won't read it, won't remember it, and will resent it.

### Progressive Disclosure (The A Dark Room Model)

A Dark Room is the gold standard for onboarding in text games:

1. **Start with one action.** The player can only do one thing (light a fire). This is impossible to get wrong.
2. **Each new mechanic appears when the player is ready.** Resource gathering unlocks after the fire is stable. Village management unlocks after resources accumulate. Exploration unlocks after the village is established.
3. **The interface itself grows.** New UI elements appear as new systems unlock. The player never sees a button they can't use yet.
4. **No tutorials, no explanations.** The lack of instructions is intentional. Players learn through experimentation, failure, and curiosity.

### Graduated Complexity

From game onboarding research, the principle of introducing one mechanic at a time is fundamental:

- **Session 1 / First 5 minutes:** Core interaction only. Movement, looking, one or two basic commands. The environment should make the correct action obvious.
- **Session 2 / Minutes 5-15:** Introduce a second system through a natural puzzle. Need a key to open a door? That teaches inventory. Need to talk to someone? That teaches dialogue. The puzzle IS the tutorial.
- **Session 3 / Minutes 15-30:** Combine systems. Use an item in dialogue. Navigate to a specific location to solve a puzzle. By now, the player has internalized the basics through practice.
- **Ongoing:** New mechanics can be introduced throughout the game as long as they're introduced one at a time, in a safe context, before being used in a challenging one.

### How Specific Games Teach

**Zork's approach:** Drop the player in a world and let them fumble. This worked in 1980 when players expected to experiment, but modern players have lower tolerance for aimlessness. Zork's saving grace: the responses are entertaining even when you fail, so experimentation feels rewarding, not punishing.

**80 Days' approach:** The map and the clock immediately communicate the goal (get around the world in 80 days). Every choice has visible consequences (money goes up or down, time passes, you move on the map). The UI teaches the game — no tutorial needed.

**Disco Elysium's approach:** The opening scene IS the tutorial. You wake up with amnesia, so every question you ask about the world is also teaching the player about the world. The first few skill checks are low-stakes and introduce the system gently. Passive checks fire automatically, teaching players that their build matters without requiring them to understand the system yet.

### Practical Onboarding Techniques

1. **NPCs as tutors.** A companion character or local NPC can offer hints naturally: "Have you tried examining that?" feels like dialogue, not instruction.
2. **Environmental teaching.** Place the solution before the problem. If the player finds a rope, THEN encounters a crevice, the connection is natural. If the crevice comes first, the player doesn't know to look for rope.
3. **Generous synonyms.** In parser games, accept every reasonable phrasing. If the player types "pick up," "take," "grab," or "get," they should all work. Early in the game, you can even suggest alternatives: "'pick up' works too, by the way."
4. **A help command, not a help dump.** Make "help" available but contextual. If the player types "help" during combat, show combat commands. If during exploration, show exploration commands. Don't dump everything at once.
5. **Reward curiosity, don't punish it.** Early-game experimentation should never result in death, locked-out content, or unrecoverable states. Save those for later, when the player knows the rules.

---

## 6. Common Pitfalls

### Ron Gilbert's Rules (from "Why Adventure Games Suck," 1989)

Ron Gilbert wrote this while designing The Secret of Monkey Island. These rules shaped a generation of adventure design:

1. **End objective must be clear.** The player should always know what they're trying to accomplish, even if they don't know HOW yet.
2. **Sub-goals should be obvious.** There should always be something the player is actively trying to do in the short term.
3. **Solve the puzzle before finding it (order matters).** Find the rope BEFORE the crevice. Finding the solution before the problem feels clever. Finding the problem before the solution feels frustrating.
4. **Never require an item that can't be retrieved later.** If a player can miss a critical item permanently, that's a design failure. Either make the item always accessible or don't make it critical.
5. **Don't have dead ends.** The player should never reach an unwinnable state without knowing it. If the game becomes unwinnable, it should be immediately obvious, not discovered 2 hours later.
6. **Don't kill the player without warning.** Frequent, unforeshadowed deaths were a hallmark of Sierra games and are universally frustrating. If death is possible, telegraph the danger clearly.

### The Guess-the-Verb Problem

This is the single most cited frustration in parser-based text adventures. The player knows WHAT they want to do but can't figure out the exact WORDS the game expects.

**How to avoid it:**

- **Accept synonyms aggressively.** "push," "press," "hit," "activate," "use" — for a button, all of these should work.
- **When a reasonable attempt fails, hint at the right approach.** Instead of "I don't understand that," try: "You try to push the panel, but it seems like it needs something more specific. Maybe you need to TURN something?"
- **Reduce the verb set.** Fewer verbs = fewer guessing opportunities. Classic IF uses 50+ verbs. Modern designs often work with 10-15. The fewer verbs players must learn, the fewer opportunities for guess-the-verb frustration.
- **Consider choice-based input.** Presenting available actions as a menu eliminates guess-the-verb entirely while preserving the text-adventure feel. This is why choice-based IF (Twine, Ink, ChoiceScript) has largely supplanted parser IF in commercial games.

### The EXAMINE vs. SEARCH Trap

Making EXAMINE and SEARCH produce different results is a recipe for frustration:

- If the player knows SEARCH exists, they must SEARCH every single object when stuck — a grinding chore.
- If they don't know SEARCH exists, they miss content through no fault of their own.
- **Solution:** Merge them. EXAMINE should reveal everything. If you want discovery to require effort, make the player DO something specific and logical (open the drawer, lift the rug) rather than use a separate observation verb.

### Re-Examining Objects

Requiring the player to examine an already-examined object again (because it changed state) without hinting at the change is deeply frustrating:

- If the player examined something once and got a response, they won't examine it again without reason.
- If an object's state changes, provide a visible or audible clue: "You hear a click from the bookshelf." Now the player has a reason to re-examine.
- **Never require re-examining without a signal.** If you do, the player will feel they must re-examine EVERYTHING constantly, which is soul-crushing.

### Secret State Changes

When the game's state changes behind the scenes without feedback:

- An action in Room A silently unlocks something in Room B — and the player has no way to know.
- **Solution:** Always telegraph state changes. A sound, a message, a visible change. "You hear a distant rumble" is enough to signal that something changed somewhere.

### Unfair Puzzles

- **Mind-reading puzzles:** Solutions that require knowledge the player has no way to obtain. ("Use the rubber chicken with the pulley" is famous precisely because it's absurd — but Monkey Island gets away with it through comedy.)
- **Pixel-hunting equivalents in text:** Critical items or exits mentioned only in passing, easy to miss in a wall of text. Solution: important interactive elements should be in their own sentence or clause, not buried mid-paragraph.
- **Zany solutions without hints:** Using objects in ways that are impossible to guess, even in hindsight. Every puzzle should have at least one hint pointing toward the solution. In hindsight, the player should think "I should have seen that" — not "how could anyone have guessed that?"

### Dead Ends and Softlocks

- **Unwinnable states** that the player doesn't know about are the worst design sin in adventure games. The player continues playing for hours, not knowing they can never finish.
- **Solutions:**
  - Don't have unwinnable states at all (the Monkey Island approach).
  - If you must have them, make them immediately obvious ("The bridge collapses behind you. You can't go back.").
  - Auto-save before points of no return.
  - Consider a "have I soft-locked?" hint system.

### Maze and Mapping Frustrations

- **Mazes without landmarks** are universally hated. If you include a maze, give it logic — distinguishing features, a pattern, environmental clues.
- **Random or unmappable spaces** violate the player's trust. They should always be able to build a reliable mental model of the space.
- **Solution:** If navigation complexity is a design goal, make it a puzzle with a solution, not an endurance test.

### Tone and Writing Pitfalls

- **Purple prose.** Overwritten descriptions slow the game to a crawl. Be vivid but concise. One sharp detail beats three generic adjectives.
- **Inconsistent tone.** If the game is serious, a joke response to a normal action breaks immersion. If the game is funny, a deadly serious consequence without warning feels unfair.
- **Passive voice / distanced narration.** Text adventures are immediate. "You open the door" is stronger than "The door is opened." Keep the player as the active agent.
- **Repetitive responses.** If the player does something the game doesn't understand, vary the "I don't understand" messages. Repeated identical failure messages feel like hitting a wall.

---

## 7. Sources

### Articles and Blog Posts

- [Text Adventure Game Design in 2020 — Chris Ainsley](https://medium.com/@model_train/text-adventure-game-design-in-2020-608528ac8bda) — Comprehensive guide covering guess-the-verb, EXAMINE vs SEARCH, state changes, and other pitfalls
- [Eliminating "Guess the Verb" — Text Adventures Blog](https://blog.textadventures.co.uk/2011/07/11/eliminating-guess-the-verb/) — Solutions to the most common parser frustration
- [The 14 Deadly Sins of Graphic-Adventure Design — The Digital Antiquarian](https://www.filfre.net/2015/07/the-14-deadly-sins-of-graphic-adventure-design/) — Ron Gilbert's design rules analyzed
- [Why Adventure Games Suck — Ron Gilbert (1989)](https://grumpygamer.com/why_adventure_games_suck/) — The foundational text on adventure game design failures
- [Standard Patterns in Choice-Based Games — Sam Kabo Ashwell](https://heterogenoustasks.wordpress.com/2015/01/26/standard-patterns-in-choice-based-games/) — Taxonomy of IF structural patterns (time cave, gauntlet, branch-and-bottleneck, etc.)
- [Beyond Branching: Quality-Based, Salience-Based, and Waypoint Narrative Structures — Emily Short](https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/) — Advanced narrative structures beyond simple branching
- [Storylets: You Want Them — Emily Short](https://emshort.blog/2019/11/29/storylets-you-want-them/) — Storylet-based narrative design
- [Narrative Design 102: Interactive Story Techniques — Johnnemann Nordhagen](https://johnnemann.medium.com/narrative-design-102-interactive-story-techniques-7e998208afa9) — Delayed consequences and state tracking
- [Text-Based Game Design: Principles, Examples, Mechanics — Game Design Skills](https://gamedesignskills.com/game-design/text-based/) — Broad overview of text game design
- [Disco Elysium RPG System Analysis — Gabriel Chauri](https://www.gabrielchauri.com/disco-elysium-rpg-system-analysis/) — Deep analysis of Disco Elysium's skill and dialogue systems
- [Disco Elysium's Unique Skill Checks — Oreate AI Blog](https://www.oreateai.com/blog/beyond-the-dice-roll-understanding-disco-elysiums-unique-skill-checks/39f4f589c2a7441b60b488c0b1896bd0) — How skills function as narrative voices
- [Q&A: Jon Ingold on Sorcery! and crafting interactive fiction — Game Developer](https://www.gamedeveloper.com/design/q-a-jon-ingold-on-i-sorcery-i-and-crafting-interactive-fiction) — inkle's design philosophy
- [2014: 80 Days — 50 Years of Text Games](https://if50.substack.com/p/2014-80-days) — Design analysis of 80 Days
- [DM4 Chapter 50: The Design of Puzzles — Graham Nelson](http://inform-fiction.org/manual/html/s50.html) — Classic puzzle design principles for IF
- [The Craft of Adventure — Graham Nelson](https://www.inform-fiction.org/manual/html/ch8.html) — Foundational text on interactive fiction design
- [How to write room descriptions — Writing Games](https://writing-games.com/how-to-write-room-descriptions-tips-and-examples/) — Practical room description guidance
- [Room Descriptions, Place, and Interiority — sub-Q Magazine](https://sub-q.com/room-descriptions-place-and-interiority/) — Advanced room description techniques
- [The Tutorial Trap: How to Onboard Players Without Killing Your Game — Wayline](https://www.wayline.io/blog/tutorial-trap-onboarding-players) — Game onboarding best practices
- [Problems of Modern Interactive Fiction — Game Developer](https://www.gamedeveloper.com/design/problems-of-modern-interactive-fiction-and-text-adventures-games-development) — Contemporary challenges in IF development
- [A Dark Room: The Cormac McCarthy of text-based iPhone games — Slate](https://slate.com/technology/2014/05/a-dark-room-the-cormac-mccarthy-of-text-based-iphone-games.html) — Analysis of A Dark Room's minimalist design
- [Ten Great Adventure-Game Puzzles — The Digital Antiquarian](https://www.filfre.net/2018/11/ten-great-adventure-game-puzzles/) — What makes puzzles great rather than frustrating
- [Typography and Usability in Game Design — Katelyn Lindsey](https://dtc-wsuv.org/klindsey17/typographyFinal/) — Typography principles for games
- [Typography in Game Interface — IndieKlem](https://indieklem.com/13-the-basics-of-typography-in-game-interface/) — Typographic hierarchy and accessibility
- [Text-Based Game Design — CS Pomona](https://cs.pomona.edu/classes/cs181g/notes/text-based.html) — Academic overview of text game design

### GDC Talks

- [Adventures in Text: Innovating in Interactive Fiction — Jon Ingold, inkle (GDC 2015)](https://gdcvault.com/play/1021774/Adventures-in-Text-Innovating-in) — Choice design, pacing, text length, and integrating words into game design
- [Classic Game Postmortem: Zork — Dave Lebling (GDC 2014)](https://www.gamedeveloper.com/audio/video-i-zork-i-classic-game-postmortem-from-gdc-2014) — Creating the first great text adventure
- [Classic Game Postmortem: Adventure — Warren Robinett (GDC 2015)](https://gdcvault.com/play/1021860/Classic-Game-Postmortem) — Origins of the adventure game genre
- [Interactive Narrative GDC Talks — Emily Short's roundup](https://emshort.blog/2015/04/02/interactive-narrative-gdc-talks-part-1/) — Overview of multiple narrative design talks from GDC
- [Leading Players Astray: 80 Days and Unexpected Stories — Meg Jayanth](https://emshort.blog/2015/04/02/interactive-narrative-gdc-talks-part-1/) — Tension between mechanics and story in 80 Days

### Tools and Frameworks Referenced

- [ink — inkle's narrative scripting language](https://www.inklestudios.com/ink/) — Open-source scripting language for interactive fiction
- [Inform 7](https://ganelson.github.io/inform-website/) — Natural-language programming for parser IF
- [TerminalTextEffects](https://github.com/ChrisBuilds/terminaltexteffects) — Python library for terminal text animations
- [Build Your Own Command Line with ANSI Escape Codes](https://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html) — Practical ANSI color implementation guide
