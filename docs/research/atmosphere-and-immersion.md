# Atmosphere and Immersion in Retro-Styled and Terminal-Based Games

A research guide for creating compelling atmosphere in text-heavy, terminal-aesthetic games. Compiled from game design articles, developer blogs, GDC talks, and case studies of successful games in this space.

---

## Table of Contents

1. [Atmosphere Through Text](#1-atmosphere-through-text)
2. [ASCII Art and Terminal Aesthetics](#2-ascii-art-and-terminal-aesthetics)
3. [Sound Design for Retro Games](#3-sound-design-for-retro-games)
4. [Animation and Effects in Terminal UIs](#4-animation-and-effects-in-terminal-uis)
5. [Worldbuilding in Post-Apocalyptic/Cyberpunk Settings](#5-worldbuilding-in-post-apocalypticcyberpunk-settings)
6. [Emotional Design](#6-emotional-design)

---

## 1. Atmosphere Through Text

### The Power of Prose in Games

Text is not a compromise -- it is a medium with unique strengths. Where graphical games show a fixed visual, text lets each player construct a personal mental image that is more vivid and more frightening (or more beautiful) than any sprite could be. This is the same reason horror novels can terrify more than horror films: the reader's own imagination fills in the worst details.

**Key reference games:** Caves of Qud, Disco Elysium, Anchorhead, Sunless Sea, Planescape: Torment

### Core Techniques

#### Word Choice Controls Emotional Temperature

A single word shifts the emotional register of a sentence. A corridor can be "empty" (neutral), "deserted" (ominous), or "quiet" (peaceful). You guide the reader's emotional response without ever telling them how to feel. This is the most important tool in the text-game writer's toolkit -- every noun, verb, and adjective is a choice about mood.

**Practical rule:** Before finalizing any description, ask: "What feeling should the player have right now?" Then audit every word for alignment with that feeling.

#### Sentence Rhythm as Pacing

Long, flowing sentences create calm, wonder, or dreaminess. Short, choppy sentences create tension, fear, or urgency. This is not metaphorical -- it physically affects reading pace and breathing.

Example of tension:
> The light dies. Something moves. You freeze.

Example of wonder:
> The cavern opens before you, its ceiling lost in darkness, and from somewhere far below comes the sound of water falling endlessly into water.

**Practical rule:** Map your sentence length to the emotional arc of the scene. A slow descent into dread should start with longer sentences that progressively shorten.

#### Sensory Details Beyond Sight

Text games default to visual description, but the most atmospheric writing engages all senses. Sound is especially powerful for tension (a ticking clock, a dripping pipe, static from a dead radio). Smell triggers memory and disgust. Tactile details (cold metal, damp air, vibration underfoot) ground the player in the space.

**Practical rule:** For every important location, write at least one non-visual sensory detail. "The terminal hums under your fingers" is more immersive than "You see a terminal."

#### Brevity and Evocative Compression

Interactive fiction cannot afford the luxury of long descriptive passages -- the player is making decisions and wants momentum. The best game prose compresses maximum atmosphere into minimum words.

Bad (too much):
> You walk into a room. It is a large room with concrete walls. The walls are cracked and there is water damage. There is a desk in the center. The desk is metal. On the desk is a computer terminal. The terminal is still powered on, which surprises you.

Good (compressed, evocative):
> Concrete walls sweating condensation. A metal desk, and on it, impossibly, a terminal still alive with green light.

**Practical rule:** Write the description, then cut it in half. Then cut it again. What survives is the atmosphere.

#### Show, Don't Tell -- But Know When to Tell

"Showing" creates visceral, immersive moments. "Telling" covers ground efficiently. A game that only shows becomes exhausting. A game that only tells becomes dry. Reserve showing for moments of emotional impact; tell when you need to move the player between those moments.

Show: *The signal breaks apart mid-sentence, syllables dissolving into static.*
Tell: *The signal cuts out. You try three more frequencies. Nothing.*

### Lessons from Specific Games

**Caves of Qud:** Nominated for a Nebula Award for Best Game Writing. Uses "baroque prose" -- language that is deliberately ornate and strange, matching the alien world. A "novel's worth of handwritten lore is knit into a procedurally generated history that's unique each game." The key lesson: prose style should match world style. Qud's language IS its world.

**Disco Elysium:** Prose described as "genuinely first rate in a way that stands up to some of the great novels of the 20th century." Every line of dialogue is particular, strange, and true-to-character. The game uses branching dialogue that is "aesthetic or textural, as opposed to instrumental" -- meaning choices change how something feels, not just what happens. Lesson: text can carry the entire emotional weight of a game without any graphical support.

**Anchorhead:** A text adventure built on the Cthulhu mythos that is considered one of the best interactive fiction games ever made. Achieves horror through careful pacing of revelations, atmospheric environmental descriptions, and puzzles that are thematically integrated with the horror.

**Sunless Sea:** Creates "a sense of dread and unease" through "rich and immersive prose that makes the world feel alive and terrifying." Proves that even a game with graphical elements can lean on text as its primary atmospheric tool.

---

## 2. ASCII Art and Terminal Aesthetics

### The Aesthetic Argument for ASCII

ASCII is not a limitation to overcome -- it is a creative choice with real strengths:

1. **Theater of the mind.** Dwarf Fortress players describe the experience as "almost like reading a book." A dragon is a capital D, and then the player imagines their own dragon. This personal investment in imagination creates deeper engagement than any pre-rendered sprite.

2. **Timelessness.** ASCII never looks dated the way pixel art from 2005 looks dated. It exists outside graphical trends.

3. **Unified aesthetic.** In ASCII roguelikes, "interface, maps, and art are unified as single elements." There is no dissonance between UI and world.

4. **Mechanical depth enabled by visual simplicity.** Dwarf Fortress can simulate unprecedented complexity precisely because it does not need to render it graphically. "Complex mechanics are expressed in the most simple of visual forms."

### How Much Art Is Enough?

This is the critical design question. The spectrum runs from pure text (Zork) to fully animated ASCII (Stone Story RPG, 16,000+ hand-drawn frames). The right amount depends on what the art is doing.

**Art serves atmosphere when:**
- It establishes a location's identity on first arrival (a title card, a scene-setting illustration)
- It marks significant story moments (a revelation, a boss encounter, a dramatic change)
- It reinforces the terminal-computer fiction (boot screens, signal visualizations, system diagnostics)
- It provides environmental storytelling that text alone would be clunky at conveying

**Art becomes distraction when:**
- It appears so frequently that it loses its impact
- It slows down gameplay pacing (especially in repeated encounters)
- It competes with text for attention rather than complementing it
- It is decorative rather than meaningful

**Practical guidelines:**
- Use ASCII art for **moments**, not for everything
- A few striking pieces are worth more than many mediocre ones
- Art at scene transitions and key story beats creates a rhythm: text-text-text-ART-text-text-text
- Let the player's imagination do most of the work; art should punctuate, not replace

### Lessons from Specific Games

**Cogmind (Grid Sage Games):** Contains ~600 pieces of ASCII art. Design philosophy emphasizes "maximum immersion wherever possible, avoiding game-y interface elements that are not part of the game world itself." Uses the "line art" category of ASCII -- line segments and occasional blocks forming semi-abstract outlines. Critical design choice: "When nothing is happening there's lots of black on the map and nothing is moving/animated" -- this makes important details stand out. The deliberate use of negative space is as important as the art itself.

**Stone Story RPG:** Proves ASCII can be beautifully animated. All animation is created by "typing the frames in .txt files," following traditional animation principles (keyframes, inbetweens, timing). The developer started by studying ASCII art from the 1990s as a hobby. Lesson: if you animate ASCII, follow actual animation principles -- reference, keyframes, timing -- not just random movement.

**Dwarf Fortress:** Won a "most beautiful game" poll despite being pure ASCII. The abstraction is the appeal. Lesson: do not assume players want more graphical detail. Some players actively prefer the imagination space that abstraction provides.

### Terminal Aesthetic as Fiction

When your game IS a terminal (as in a hacking game or a signal-monitoring scenario), the ASCII aesthetic is not just style -- it is diegetic. The player is literally looking at a terminal. This means:

- UI elements (menus, status bars, input prompts) are part of the world
- Glitches and artifacts are narrative events, not just effects
- The limitations of the display are the limitations of the character's equipment
- Upgrading the terminal or tuning signals can literally change what the player sees

This is a massive advantage over graphical games. Every visual element has a story reason to exist.

### Color as a Tool

In a terminal aesthetic, color is precious. A primarily green-on-black or amber-on-black display makes any other color immediately significant:

- Red for danger, warnings, critical failures
- Cyan/blue for new information, signals, connections
- White for emphasis, system messages
- Yellow for caution, degradation
- Dim/gray for background, unimportant, or decayed text

**Practical rule:** Establish a strict color vocabulary early and use it consistently. When everything is green, a single red word is an event.

---

## 3. Sound Design for Retro Games

### Why Sound Matters (Even If Your Game Is Currently Silent)

Sound and music are the single most efficient way to establish atmosphere. A game can survive without graphics (text adventures prove this). A game can survive without sound (many do). But adding the right sound to a text game is a force multiplier for immersion that no amount of text can replicate.

Plan for sound even if you implement it later. Knowing where sound will go affects how you write and pace scenes.

### The Power of Silence

Paradoxically, the most important sound design principle is knowing when NOT to play sound.

> "Silence isn't just the absence of noise; it's an active element of your sound design palette -- like a painter using negative space to highlight a subject."

> "The biggest mistake developers make is filling every available sonic space, creating a wall of sound -- a relentless barrage of noise that numbs the player's senses and diminishes the impact of truly important audio cues."

**Practical application for a terminal game:**
- Default state: near-silence, maybe a faint hum or white noise
- Sound enters when something happens: a signal is received, a system alerts, something goes wrong
- Music reserved for story peaks, moments of revelation or danger
- After intense audio moments, return to silence -- let it breathe

### Ambient Sound for Terminal Games

The terminal fiction suggests specific ambient sounds:
- Low electrical hum of equipment
- Faint static or white noise from monitoring equipment
- Occasional distant sounds (if the setting suggests an environment beyond the terminal)
- Keyboard/interface sounds as the player types
- Signal-related sounds: bursts of data, radio static, decoded fragments

**Practical rule:** Ambient sound should be so subtle that the player doesn't consciously notice it -- but would notice its absence. "You really want players to not even 'hear' any music at all."

### Synthwave/Retrowave for Cyberpunk and Retro Settings

Synthwave is built on "iconic analog synth emulation, thick basses, lush pads, heavy use of chorus and reverb effects, and rhythms from classic 80s drum machines." Its popularity in games was driven by Hotline Miami and Far Cry 3: Blood Dragon.

**When synthwave works:**
- Title screens and menus (sets the vibe without competing with gameplay)
- Travel/transition sequences
- High-energy moments (chases, confrontations, time pressure)
- Credits and endings

**When synthwave does not work:**
- During text-heavy reading passages (competes for attention)
- Constant background during exploration (becomes wallpaper, loses impact)
- Moments of dread or horror (synthwave is energizing, not unsettling)

**Alternative for atmosphere:** Dark ambient, drone, or minimal synth. Think Blade Runner soundtrack (Vangelis) rather than Hotline Miami (Perturbator). For a signal-monitoring game, the aesthetic is more lonely operator in a dark room than neon-soaked nightclub.

### Planning for Audio Integration

Even before implementing audio:
1. **Mark audio cues in your design.** Note in scene descriptions where sound would play. "A burst of static. Then silence. Then a voice."
2. **Write with rhythm that implies sound.** Ellipses, line breaks, and pacing in text create a "soundtrack" the reader hears internally.
3. **Design audio-ready moments.** Scenes that have natural audio punctuation (a signal arriving, an alarm triggering, a system booting) will be easiest to enhance later.
4. **Consider the dynamic range.** Your quietest moment to your loudest moment should have significant contrast. If everything is at the same intensity, nothing has impact.

---

## 4. Animation and Effects in Terminal UIs

### The "Less Is More" Principle

This is the single most important rule for terminal animations. Every effect you add has diminishing returns, and overuse transforms atmosphere into annoyance.

> When nothing is happening, lots of black and nothing moving is a conscious decision to make important details more clearly visible. -- Cogmind developer

The baseline state should be still. Stillness creates the contrast that makes movement meaningful.

### Typing/Typewriter Effects

The classic terminal animation. When done right, it creates the feeling of a living system communicating with you. When done wrong, it makes players mash the skip button.

**Best practices:**
- **Always provide a skip/instant option.** Players reading for the second time (or impatient players on the first) should never be trapped watching text crawl.
- **Variable speed communicates emotion.** Faster typing = urgency, excitement. Slower typing = hesitation, dread, system strain. Pauses mid-sentence = something is wrong.
- **Per-character sound (the Undertale method).** Undertale and Deltarune play a sound for each character revealed, with different sounds per character voice. This transforms text display into a kind of speech. "The brain accepts it as voice for the character without an issue."
- **Do not use typing effects for all text.** System messages, menus, and repeated information should appear instantly. Reserve the typewriter for narrative moments, incoming signals, or NPC communication.
- **Speed should match content.** Action sequences: fast. Mysterious transmissions: slow with pauses. Normal descriptions: medium or instant.

**Undertale's text system as a model:**
- Different fonts per character (Sans speaks in Comic Sans, Papyrus in Papyrus)
- Waving or shaking text baselines for emotional emphasis
- Color changes for specific words
- Per-character audio with unique sounds per speaker
- All of these are used sparingly, which is why they land hard when they appear

### Screen Transitions

Transitions between scenes/locations should reinforce the terminal fiction:
- **Static burst / signal loss:** Good for moving between frequencies or losing a connection
- **Screen clear / scrolling:** The classic terminal approach, feels authentic
- **Flicker / momentary blackout:** Brief, not prolonged -- a half-second flash, not a two-second fade
- **Progressive text replacement:** Old text scrolls up as new text appears, like a real terminal

**What to avoid:**
- Fancy graphical transitions (wipes, fades, dissolves) that break the terminal fiction
- Transitions so long they break pacing
- Transitions so frequent they become rhythm-destroying

### Glitch Effects

Glitch effects are powerful in a terminal game because they are diegetic -- the terminal IS glitching. But they are extremely easy to overuse.

**When glitch effects work:**
- Signal degradation (the connection is failing, information is corrupted)
- Story moments of system compromise (something is attacking or interfering with the terminal)
- Brief flashes during revelations or shocks (the system reacts to what it receives)
- Environmental storytelling (an old, damaged system that flitches occasionally)

**When glitch effects do not work:**
- Constant background effect (becomes visual noise, loses meaning)
- During text the player needs to read (never glitch readable content unless the point IS that it is unreadable)
- As generic "cool factor" with no narrative justification

**Types of glitch:**
- Digital glitch: block displacement, color channel splitting -- feels like data corruption
- Analog glitch: smooth noise, scan lines, rolling -- feels like old hardware
- Choose based on your fiction. A digital signal-monitoring station should have digital glitches.

### Screen Shake

> "Screen shake is not recommended when players are reading text."

In a text-heavy game, screen shake is almost always the wrong choice. Rotation-based shake is the least disruptive to reading, but even that should be rare. Reserve it for extreme events: an explosion, a catastrophic system failure, something physically impacting the space the terminal is in.

**Practical rule:** If the player is reading, do not shake. If you must shake, keep it under half a second with a rapid diminish.

### Pacing of Animations

- **Build a rhythm.** Long stretches of still text, punctuated by brief animations at key moments, creates a heartbeat-like pacing.
- **Match animation duration to narrative importance.** A routine system check: instant. A first-contact signal: slow, deliberate reveal.
- **Never make the player wait for something they have already seen.** Repeatable events should have abbreviated or skippable animations.
- **Test with someone who reads slowly and someone who reads fast.** Your timing needs to work for both.

---

## 5. Worldbuilding in Post-Apocalyptic/Cyberpunk Settings

### Environmental Storytelling Over Exposition

The best games in these genres build worlds through discovery rather than explanation. The player pieces together what happened from fragments, and the act of reconstruction IS the engagement.

> "Environmental storytelling is an immediate tool that uses physical space to convey specific narrative details through crafting interactive or visually evocative environments." -- Game Design Skills

In a text game, "environmental storytelling" means found documents, ambient descriptions, and details in scene text that imply history without explaining it.

### The Four Types of Environmental Storytelling

Based on GDC talks by Harvey Smith, Matthias Worch, and others:

1. **Evocative spaces:** Settings that trigger associations from the real world or genre conventions. A bombed-out city. A corporate server room. A radio tower at the edge of civilization. These work because the player brings their own knowledge.

2. **Staging:** The deliberate arrangement of objects/details to tell a micro-story. In text: "Two chairs facing each other. One overturned. A mug shattered on the floor." The player infers the confrontation.

3. **Completable narratives:** Found documents, logs, and messages that the player assembles into a story. This is the Fallout terminal entry approach and the System Shock audio log approach.

4. **Hub narratives:** Ongoing stories told through returning to the same space and seeing changes over time.

### Found Documents: The Core Technique

Found documents are the bread and butter of worldbuilding in text-heavy games. They work because:

- They are diegetic: the character is literally reading something that exists in the world
- They provide information without breaking the fourth wall
- They let the player control pacing (read now or save for later)
- They create dramatic irony (the player knows things the character does not, or vice versa)
- They reward exploration and curiosity

**Best practices for found documents:**

1. **Each document should tell a micro-story.** Not just lore dumps -- a person wrote this for a reason. What did they want? What were they afraid of? What happened next?

2. **Voice matters.** A corporate memo sounds different from a personal diary entry, which sounds different from a hastily scrawled note. The voice tells you about the writer without exposition.

3. **Create document chains.** A series of logs from the same person over time is more compelling than isolated entries. The reader watches a situation deteriorate (or improve) through the writer's eyes.

4. **Leave gaps.** The best document chains are incomplete. Log 1, Log 3, Log 7. What happened in between? The player's imagination fills in the worst parts.

5. **Connect documents to the world.** A log that mentions a locked door is more compelling when you find that door. A warning about a signal frequency gains weight when you tune to that frequency.

### Fallout's Terminal Entries: A Case Study

Fallout's terminal entries are considered the gold standard of found-document worldbuilding:

- "Through audio logs, terminal entries, and scattered belongings, the stories of the past come to life, shedding light on the lives, struggles, and aspirations of those who lived and died before the world was forever changed."
- Individual terminal chains tell complete mini-stories: a bandit leader bitten by a rabid dog, slowly going insane, documented by his own increasingly erratic entries.
- The entries give the player codes, quest hooks, and context -- they are both narrative and mechanically useful.

### System Shock's Audio Logs: Another Case Study

System Shock pioneered the "storytelling through found media in a hostile environment" approach:

- "Codes to unlock doors and steps needed to foil SHODAN's schemes exist either as part of the level or in the many audio logs left behind by TriOptimum employees and SHODAN's minions."
- "The way the story unfolds through e-mail messages collected while exploring the station, along with detailed surrounding elements, creates a convincing world."
- Solutions to puzzles are scattered across different areas, requiring the player to remember and connect information from multiple sources.

### Cyberpunk-Specific Worldbuilding

Cyberpunk settings thrive on contrast and layering:

- **High-tech / low-life contrast.** Sleek corporate systems alongside jury-rigged survival tech. In text: describe both the sophistication and the decay.
- **Corporate language as worldbuilding.** Memos, ToS agreements, automated messages -- the voice of the corporation is cold, euphemistic, and reveals more than it intends.
- **The network as a place.** In cyberpunk, digital spaces have geography. Servers, nodes, firewalls, data streams -- describe them as locations, not abstractions.
- **Stratification.** Every location should communicate where it sits in the social hierarchy. A corporate terminal has clean prompts and full functionality. A scavenged terminal has corrupted sectors, missing data, and patched firmware.

### Post-Apocalyptic Worldbuilding

The core appeal of post-apocalyptic settings is archaeology -- understanding what was from what remains.

- **Contrast between before and after.** A cheerful pre-apocalypse document found in a devastated present is inherently powerful.
- **Technology as relic.** Every working piece of technology is remarkable. Describe it with the reverence it deserves in context.
- **Language drift.** If enough time has passed, language itself has changed. New slang, lost concepts, repurposed words.
- **The mystery of the fall.** Don't explain the apocalypse upfront. Let the player assemble the picture from fragments. Contradictory accounts are realistic and more interesting than a single authoritative explanation.

---

## 6. Emotional Design

### Making Players Care

Players care about characters and stories when they have invested something: time, attention, decisions, or curiosity. Emotional engagement is not a feature you add -- it is the result of design decisions across every system.

### The Investment Ladder

1. **Curiosity** (lowest investment): Something is strange or unexplained. The player wants to know more.
2. **Understanding**: The player begins to piece together what is happening. Pattern recognition is inherently rewarding.
3. **Empathy**: The player recognizes something human in a character or situation. This requires specificity -- generic tragedy does not move people; specific, detailed, particular tragedy does.
4. **Attachment**: The player has spent enough time with a character or situation that they feel ownership. They care what happens next.
5. **Consequence** (highest investment): The player's decisions have visibly affected something they care about. This is where emotional design and game design fuse.

### Mystery and Revelation Pacing

Mystery is the engine of narrative engagement. The player stays because they need to know.

**The drip-feed principle:**
> "Systems suspense can help you create comfortable pacing by breadcrumbing the system over time. This judicious building-out of your game's world and the rules that govern it, and hinting at rules that will be important but are heretofore undefined, inspires in players the determination to solve those mysteries."

**Practical pacing structure:**
1. **Hook:** Present an immediate mystery in the first minutes. Not the BIG mystery -- a small, graspable one.
2. **First answer, new question:** Resolve the small mystery, but the answer opens a larger question.
3. **Expanding scope:** Each layer of revelation expands the scope of what the player thought they were dealing with.
4. **False understanding:** Let the player think they understand the full picture. Then pull the rug.
5. **True revelation:** The actual scope/meaning is different (and bigger, or more personal) than expected.

**Rules:**
- Never answer a question without raising a new one (until the very end)
- Some questions should be answered quickly to maintain trust that answers exist
- Some questions should linger for a long time to build anticipation
- Not every question needs an answer -- some mysteries are better left open
- The player should always have at least one active question pulling them forward

### The Amnesia Protagonist: How to Do It Well

The amnesia protagonist is one of the most common tropes in games, and for good reason: it elegantly solves the problem of information asymmetry between player and character.

**Why it works:**
- Player and character start with the same knowledge (none)
- Discovery is shared -- every revelation is new to both
- "The amnesia trope's inherent vulnerability can be a potent source of emotional connection between the player and character. The player empathizes with the character's disorientation, their fear, and their desperate need to understand."
- Memory recovery can serve as both narrative reward and game mechanic

**How to do it well:**

1. **Make the amnesia matter narratively, not just mechanically.** The lost memories should be thematically significant. WHY the character lost their memory should connect to the central themes.

2. **Give the character a present-tense personality.** Amnesia erases the past, not the person. The character should have reactions, preferences, and voice from moment one. Disco Elysium's protagonist has amnesia but is immediately, aggressively characterized by his responses.

3. **Earn the memories.** Memory recovery should come through player action -- exploration, puzzle-solving, decisions -- not just cutscenes at predetermined points. "When the player visits a new location or defeats a familiar mini-boss, a memory is unlocked as a puzzle piece."

4. **Make the player dread the truth.** The best amnesia stories hint early that the truth might be terrible. The player wants to know and is afraid to know simultaneously. This tension is pure engagement fuel.

5. **Avoid the "you were the villain" cliche** unless you can execute it with genuine nuance. The reveal should complicate the player's understanding, not just shock them.

6. **Let the player become the protagonist.** Frictional Games (Amnesia: The Dark Descent) designed for players to think "I am" instead of the character's name. This means minimizing moments where the character acts independently of the player.

**How to do it badly:**
- Amnesia as lazy exposition avoidance (the character conveniently forgot everything the player needs to learn)
- No personality beyond the amnesia (the character is a blank slate with no voice)
- Memories dumped in non-interactive cutscenes
- The lost past has no connection to the present gameplay
- The truth is disappointing relative to the mystery

### Emotional Writing Techniques

**Character voice through text mechanics (the Undertale model):**
- Different characters can have different text display speeds, fonts, or formatting
- Emotional states can change text behavior (shaking text for fear, slow text for sadness)
- A character's "voice" in text includes their vocabulary, sentence structure, and what they choose to mention or omit

**The Disco Elysium approach to flawed protagonists:**
- "The game's most important take-away is acceptance -- you are a complete failure of a man, yet through perseverance and tenacity people around you can grow to accept you."
- Flawed characters are more compelling than competent ones. Weakness creates stakes, vulnerability creates empathy.
- Internal monologue as game mechanic -- the character's own thoughts can disagree with each other, creating internal drama.

**Emotional design through systems:**
- Choices that affect character relationships create investment
- Resources the player manages that represent something they care about (a companion's health, a signal's integrity, a base's safety) create anxiety
- Loss is more emotionally powerful than gain. Let the player have something, then threaten it.

---

## Summary: Practical Principles for Signal Game

Distilled from all of the above, here are the most actionable principles:

### Writing
1. Every word serves atmosphere. Audit ruthlessly.
2. Use sentence rhythm to control pacing and emotion.
3. Compress. Then compress again. Brevity is power in interactive text.
4. At least one non-visual sensory detail per location.
5. Found documents should tell micro-stories with voice and stakes.

### Visual Design
6. ASCII art for moments, not for everything. Let rarity create impact.
7. Negative space (blackness, stillness) is as important as content.
8. Establish a strict color vocabulary and enforce it.
9. The terminal IS the fiction -- every UI element has a story reason.

### Sound (Future)
10. Plan audio-ready moments now, implement later.
11. Silence is the default. Sound is the punctuation.
12. Dark ambient over synthwave for a signal-monitoring mood.
13. Dynamic range matters -- quiet to loud should be a wide spectrum.

### Animation
14. Still is the baseline. Movement is the exception.
15. Typing effects for narrative moments only; instant display for everything else.
16. Always allow skip. Always.
17. Glitch effects are diegetic events, not decoration.
18. Never shake the screen while the player is reading.

### Worldbuilding
19. Explain nothing upfront. Let the player assemble the picture.
20. Document chains > isolated logs. Incomplete chains > complete ones.
21. Contrast (high-tech/low-life, before/after) is the engine of the genre.
22. Every working piece of technology is a story about who maintained it and why.

### Emotional Design
23. Always give the player an active question pulling them forward.
24. Answer small questions quickly (builds trust). Let big questions linger (builds anticipation).
25. The amnesia protagonist works when the amnesia IS the theme, not just a convenience.
26. Flawed characters with present-tense personality > blank-slate vessels.
27. Let the player dread the truth before they find it.

---

## Sources

### Atmosphere Through Text
- [Techniques For Atmosphere and Mood Building In Fiction](https://writershelpingwriters.net/2008/08/creating-atmosphere/)
- [How To Create Atmosphere & Mood In Your Writing](https://www.thesaurus.com/articles/creating-atmosphere-mood)
- [How to Create Atmosphere in Writing for Any Genre](https://writestats.com/how-to-create-atmosphere-in-writing-the-secret-to-unforgettable-stories/)
- [Postmortem: How to Write Compelling Interactive Fiction](https://medium.com/@alex.kubodera/postmortem-how-to-write-compelling-interactive-fiction-55168fc43ece)
- [Game Writing with Text Adventure Games (SFWA)](https://www.sfwa.org/2024/08/20/game-writing-with-text-adventure-games/)
- [13 Text-Based Horror Games to Play Alone in the Dark](https://storytellerkim.com/index.php/2021/10/04/13-text-based-horror-games-to-play-alone-in-the-dark/)
- [Understanding the Meaningless, Micro-Reactive, and Marvellous Writing of Disco Elysium](https://www.gamedeveloper.com/business/understanding-the-meaningless-micro-reactive-and-marvellous-writing-of-i-disco-elysium-i-)
- [Why Writing Matters: Literary Qualities of Disco Elysium and Planescape: Torment](https://alexanderwinter.se/gaming-texts/literary-writing-in-disco-elysium-and-planescape-torment/)
- [The 2025 Nebula Award for Best Game Writing: Caves of Qud](https://kitfoxgames.medium.com/the-2025-nebula-award-for-best-game-writing-a-case-for-caves-of-qud-17a00794b809)

### ASCII Art and Terminal Aesthetics
- [Cogmind ASCII Art Design](https://www.gridsagegames.com/blog/2014/03/ascii-art/)
- [Cogmind ASCII Art: The Making Of](https://www.gridsagegames.com/blog/2014/03/cogmind-ascii-art-making/)
- [Anatomy of an ASCII Title Screen (Cogmind)](https://www.gridsagegames.com/blog/2014/11/anatomy-ascii-title-screen/)
- [ASCII vs. Tiles (Cogmind)](https://www.gridsagegames.com/blog/2015/02/ascii-vs-tiles/)
- [Roguelike Development with REXPaint](https://www.gamedeveloper.com/design/roguelike-development-with-rexpaint)
- [The Use of ASCII Graphics in Roguelikes: Aesthetic Nostalgia and Semiotic Difference](https://journals.sagepub.com/doi/10.1177/1555412015585884)
- [Stone Story RPG Developer Interview](https://www.indiegraze.com/2018/09/22/interview-stone-story-rpgs-gabriel-santos/)
- [Road to the IGF: Stone Story RPG](https://www.gamedeveloper.com/business/road-to-the-igf-martian-rex-standardcombo-s-i-stone-story-rpg-i-)
- [Stone Story RPG ASCII Tutorial](https://stonestoryrpg.com/ascii_tutorial.html)
- [10 Best Roguelikes with ASCII Art](https://gamerant.com/best-roguelikes-ascii-art/)
- [Interview with Josh Ge, Creator of Cogmind](https://www.gamedeveloper.com/design/-play-87-interview-with-josh-ge-creator-of-cogmind)

### Sound Design
- [The Role of Sound and Music in Creating Atmosphere in Games](https://gamepill.com/the-role-of-sound-and-music-in-creating-atmosphere-in-games/)
- [The Power of Silence: Mastering Audio Deprivation in Game Design](https://www.wayline.io/blog/power-of-silence-game-audio)
- [How Ambient Noise and Music Enhance Game World Immersion](https://indigomusic.com/feature/how-ambient-noise-and-music-enhance-game-world-immersion/)
- [Getting/Making Game Music: Atmospheric vs Ambient](https://www.gamedeveloper.com/audio/getting-making-game-music-that-fits---comparative-music-series---atmospheric-vs-ambient)
- [How to Make Ambiences for Games](https://www.gameaudiolearning.com/knowledgebase/how-to-make-ambiences-for-games)
- [How to Create an Audio Soundscape for Video Games](https://splice.com/blog/audio-soundscape-for-video-games/)

### Animation and Effects
- [TerminalTextEffects (TTE)](https://github.com/ChrisBuilds/terminaltexteffects)
- [Analysis of Screenshake Types](http://www.davetech.co.uk/gamedevscreenshake)
- [Transforming Game Interfaces with Animated UI](https://punchev.com/blog/transforming-game-interfaces-with-animated-ui)
- [Use Transition Screens in Your Games](https://medium.com/@FredericRP/use-transition-screens-in-your-games-unity-f8742fea219b)
- [Undertale Dialogue and Interfaces (Fonts In Use)](https://fontsinuse.com/uses/51307/undertale-dialogue-and-interfaces)

### Worldbuilding
- [Environmental Storytelling in Video Games](https://gamedesignskills.com/game-design/environmental-storytelling/)
- [GDC Vault: Environmental Narrative: Your World is Your Story](https://www.gdcvault.com/play/1012712/Environmental-Narrative-Your-World-is)
- [GDC Vault: What Happened Here? Environmental Storytelling](https://gdcvault.com/play/1012647/What-Happened-Here-Environmental)
- [GDC Vault: Environmental Storytelling: Indices and the Art of Leaving Traces](https://gdcvault.com/play/1016566/Environmental-Storytelling-Indices-and-the)
- [The Art of World-Building: How Fallout Constructs Immersive Environments](https://videogameheart.com/the-art-of-world-building-how-fallout-constructs-its-immersive-environments/)
- [Cyberpunk 2077: Worldbuilding and Game Design](https://zompist.wordpress.com/2021/02/05/cyberpunk-2077-worldbuilding-game-design/)
- [Neon & Noir: Cyberpunk Worldbuilding for RPGs & Fiction](https://academy.worldanvil.com/blog/cyberpunk-worldbuilding-guide)
- [CD Projekt Red: From Worldbuilding to Immersion](https://www.cdprojektred.com/en/blog/137/answered-podcast-episode-16-from-worldbuilding-to-immersion-crafting-universes-in-games)
- [Tapping into Procedural Generation in Caves of Qud](https://www.gamedeveloper.com/design/tapping-into-the-potential-of-procedural-generation-in-caves-of-qud)

### Emotional Design
- [How the Player Becomes the Protagonist (Frictional Games)](https://frictionalgames.com/2010-11-how-the-player-becomes-the-protagonist/)
- [Amnesia in Games: More Than Just a Plot Device](https://www.wayline.io/blog/amnesia-in-games-narrative-depth)
- [Gameplay-Guided Amnesia (TV Tropes)](https://tvtropes.org/pmwiki/pmwiki.php/Main/GameplayGuidedAmnesia)
- [All Video Game Characters Have Amnesia (Equip Story)](https://www.equipstory.com/all-video-game-characters-have-amnesia/)
- [Disco Elysium: Writing Character Flaws](https://cotyjschwabe.com/disco-elysium-an-analysis-on-writing-character-flaws/)
- [Understanding Systems Suspense](https://polarisgamedesign.com/2023/understanding-systems-suspense/)
- [Story Pacing in Game Design](https://www.meegle.com/en_us/topics/game-design/story-pacing)
