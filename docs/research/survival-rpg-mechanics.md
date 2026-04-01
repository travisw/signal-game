# Survival RPG Mechanics Research

Compiled research on game design principles for survival RPGs, drawing from published design guides, GDC talks, postmortems, and analysis of games including Fallout, Disco Elysium, Slay the Spire, FTL, A Dark Room, Caves of Qud, Darkest Dungeon, Neo Scavenger, and Dwarf Fortress.

---

## 1. Stat System Design

### How Many Stats?

The consensus across game design literature is **3-7 core stats** as the optimal range:

- **3 stats** (the "three-stat system"): Very efficient from a gameplay standpoint. Unlikely to overwhelm new players and easy to balance so no stat is broken or universally useless. Examples: many action-RPGs and simplified systems.
- **5-7 stats**: The most common sweet spot. Describes physical and mental capabilities without getting "spreadsheety." Beyond 7, you risk Choice Paralysis where players freeze up or just ignore most stats.
- **Beyond 7**: Tends to create the illusion of depth without adding real strategic choices. Players find one viable strategy and ignore the rest of the design space.

**Key principle**: Additional complexity does not automatically add depth. You can achieve meaningful strategic depth through well-designed stat interactions and derived mechanics without excessive individual stats.

### What Makes Stats Meaningful vs. Tedious?

1. **Every stat must have a clear, coded function in gameplay.** Players hate stats that are "advertised as having non-specific influence." If Perception doesn't visibly change what you notice, it feels dead.

2. **Stats should create trade-offs, not just bonuses.** The best stat systems force players to sacrifice something to gain something else. Disco Elysium does this brilliantly: high Electrochemistry makes you better at reading people's chemical states but also makes your character more susceptible to addiction.

3. **Stats should interact with multiple systems.** A stat that only affects one thing (e.g., "Fishing skill" that only matters when fishing) feels narrow. A stat that opens dialogue options AND affects combat AND changes exploration outcomes feels rich.

4. **Derived stats create emergent depth.** Rather than tracking 20 individual stats, have 4-5 base stats that combine to create derived values. HP derived from Constitution + Level. Damage derived from Strength + Weapon. This lets a small number of inputs create a larger strategic space.

### Disco Elysium's Approach (Relevant to SIGNAL)

Disco Elysium uses 4 attributes (Intellect, Psyche, Physique, Motorics), each with 6 skills underneath (24 total skills). What makes it work:

- Skills are not just numbers -- they are **characters** that speak to you. High Encyclopedia means your inner encyclopedist constantly interrupts with trivia. This is directly applicable to a text-based game.
- The **Thought Cabinet** lets players "internalize" ideas discovered through gameplay, granting permanent stat modifications. While a Thought is being researched, you get temporary penalties; after the breakthrough, permanent bonuses. Only 12 can be internalized at once, creating meaningful choices about identity.
- **Balancing feedback loop**: More powerful skills generate choice overload. The opposition comes from the player themselves, not just external enemies. This is a sophisticated way to prevent min-maxing from trivializing the game.

### Practical Recommendations for SIGNAL

- Start with **4-5 core stats** that map to the game's themes (survival, cognition, social, physical).
- Each stat should affect at least 3 different gameplay systems.
- Let stats create personality, not just numbers. In a text game, a high Perception stat should change what the player reads and notices.
- Use derived stats sparingly. HP and Energy are enough for resource pools; don't add Stamina, Fatigue, Morale, Hunger, Thirst, AND Sleep as separate bars.

---

## 2. Inventory and Resource Management

### Making Scavenging Fun, Not a Chore

The core tension: inventory management is only engaging when **every item pickup involves a meaningful decision**. The moment players mindlessly grab everything, or mindlessly ignore everything, the system has failed.

### Lessons from Neo Scavenger

Neo Scavenger has what PC Gamer called "PC gaming's best inventory system." Key design choices:

1. **Start with nothing.** The player wakes up in underpants with no carrying capacity. A plastic bag becomes a treasure because it adds 24 squares of inventory space. This makes early-game scavenging inherently exciting.

2. **Containers are gameplay.** Nearly any container can hold other things. Water bottles hold liquids, but also pebbles, pills, or bullets. An empty crisp packet works like a plastic bag. This turns mundane items into strategic tools.

3. **Realistic space, not abstract slots.** Items take up space proportional to their real size. You feel the weight and bulk of your decisions. A rifle is powerful but takes enormous space; a knife is weak but fits in a pocket.

4. **Every move costs resources.** Moving on the hex map drains meters (hunger, thirst, fatigue), so you can't just wander looking for loot. Scavenging has opportunity cost.

### Lessons from Darkest Dungeon

1. **Pre-expedition planning.** Players must decide what provisions to bring BEFORE entering a dungeon, without knowing exactly what they'll face. This creates tension before gameplay even starts.

2. **Loot competes with supplies.** Limited inventory means carrying healing items reduces space for treasure. Do you drop a bandage to pick up a gem? This is a constant micro-decision that keeps inventory management active.

3. **Supplies have specific uses.** Shovels clear rubble, keys open locks, holy water prevents curses. Bringing the wrong supplies isn't just inefficient; it can be fatal.

### Lessons from Fallout

1. **Weight limits create natural trade-offs.** Carry weight tied to Strength stat means character build affects inventory strategy. A charismatic negotiator carries less but trades better.

2. **Junk has value (Fallout 4/76).** When everything can be scrapped for crafting components, players engage with the world differently. But this can backfire -- if EVERYTHING is useful, nothing feels special.

3. **Barter as gameplay.** The barter skill in Fallout 1/2 made trading a skill-based activity, not just a menu. However, it was poorly balanced in Fallout 2, becoming borderline useless because random encounters provided infinite loot.

### Lessons from Caves of Qud

1. **Emergent item use.** Items interact with the game's simulation in unexpected ways. A vial of acid is a weapon, a lockpick, and a crafting ingredient. This rewards creative thinking.

2. **Faction-specific loot.** Different areas and factions have distinct item pools, making exploration feel varied and giving each location its own "flavor" of scavenging.

### Practical Recommendations for SIGNAL

- **Slot-based inventory** (8-12 slots) rather than weight-based. Simpler to understand in a text interface.
- **Stacking with limits.** Small items (bullets, bandages) stack to 5-10. Large items take one slot each.
- **Meaningful scarcity.** The Last of Us principle: if the player always has enough, there's no tension. If they never have enough, there's no fun. The sweet spot is "usually just barely enough."
- **Item overlap for crafting.** Same component can make different things (e.g., cloth makes either a bandage OR a filter). Forces choices.
- **Containers as progression.** Finding a backpack should feel like a significant upgrade. Start small.

---

## 3. Turn-Based Combat in Text/Simple Games

### The Core Problem

Without graphics, animation, or spatial positioning, combat risks becoming "press attack until enemy dies." Every text-based combat system must answer: **what makes each round's decision interesting?**

### 12 Principles for Better Turn-Based Combat

Drawing from Craig Stern's widely-cited design article and other sources:

1. **Meaningful choices every turn.** If "Attack" is always optimal, the system is broken. Each turn should present a genuine dilemma: attack vs. defend, target A vs. target B, use item vs. save it.

2. **Resource tension.** Combat should cost something beyond time. Ammo, energy, HP, item durability. When attacking costs resources, every swing matters. Slay the Spire's 3-energy-per-turn system is the gold standard: you can never play everything you want to.

3. **Enemy variety forces adaptation.** If every enemy is "a bag of HP," combat is identical each time. Enemies should demand different approaches: armored enemies resist physical attacks, fast enemies dodge, grouped enemies punish single-target focus.

4. **Risk/reward in every action.** A powerful attack that leaves you vulnerable. A defensive stance that wastes a turn if the enemy doesn't attack. Gambling mechanics (critical hits, dodges) add excitement when the stakes are right.

5. **Non-combat solutions.** The best survival RPGs let players avoid, flee, negotiate, or trick their way past threats. If combat is the ONLY option, it becomes a grind. Disco Elysium has zero traditional combat. Neo Scavenger lets you talk, hide, or run.

6. **Position and distance** (even in text). "The raider is far away" vs. "The raider is in your face" changes what actions make sense. Melee vs. ranged, retreat vs. engage. You don't need a grid; descriptive distance tiers work (close/medium/far).

7. **Status effects over raw damage.** Bleeding, stunned, poisoned, frightened -- these create ongoing tactical considerations. "Do I cure the bleed or press the attack?" is more interesting than "Do 5 damage or 7 damage?"

8. **Cooldowns and limited-use abilities.** Prevent the best move from being spammed. If your strongest attack has a 3-turn cooldown, you must plan around it.

9. **Environmental interaction.** Even in text: "There's an unstable pillar nearby" or "You're standing in a puddle and the enemy has a sparking wire." Contextual actions add variety without new mechanics.

10. **Escalating stakes.** Fights should get MORE dangerous as they continue, not less. Enemies that enrage, environments that deteriorate, resources that deplete. This prevents turtling and rewards aggression.

11. **Telegraphed enemy actions.** "The creature rears back to strike" tells the player a big attack is coming next turn. This creates a puzzle: do I block, dodge, or try to kill it first? Slay the Spire's visible enemy intents are the clearest implementation of this.

12. **Consequences beyond the fight.** HP doesn't fully recover. Ammo spent is gone. Items used are consumed. Injuries persist. This makes every fight a cost-benefit analysis, not just a challenge to overcome.

### How Slay the Spire Makes Every Turn Matter

- **5-card hand, 3 energy.** You always have more options than resources. Every turn is about choosing what NOT to do.
- **Visible enemy intent.** You know what's coming, turning combat into a puzzle rather than a gamble.
- **Deck management IS strategy.** Adding cards isn't always good; a bloated deck dilutes your best cards. Sometimes the best reward is removing a card.
- **No wasted mechanics.** Every card, relic, and encounter reinforces the core loop. Nothing exists just for flavor.

### Kerkerkruip: Combat in Pure Interactive Fiction

Kerkerkruip is a roguelike built entirely in the interactive fiction medium (Inform 7). It proves combat can work in pure text:

- **Reaction system**: dodge, block, parry, and roll away from attacks
- **Flow mechanic**: successful reactions increase offensive or defensive flow, adding tactical depth
- **Body-part targeting**: hit specific locations for specific effects (break an arm to disarm, hit legs to slow)
- **No grinding**: every encounter matters because the game is short-form

### Practical Recommendations for SIGNAL

- Implement **3-4 actions per turn** (attack, defend, use item, special/flee).
- Use **enemy telegraphing** ("The machine whirs louder...") to create informed decisions.
- Make **every fight cost something permanent** (ammo, HP that doesn't fully heal, item durability).
- Include **non-combat resolution** for most encounters (hide, negotiate, intimidate, outwit).
- Use **distance tiers** (close/medium/far) for simple positioning without a grid.
- Cap combat at **3-5 rounds** for regular encounters. Long fights become tedious in text.

---

## 4. Crafting Systems

### Satisfying vs. Busywork

The line between satisfying crafting and tedious busywork comes down to one question: **does the player make an interesting decision, or just follow a recipe?**

### The Last of Us: Gold Standard for Simple Crafting

The Last of Us crafting system demonstrates the power of simplicity:

1. **Two ingredients per recipe.** That's it. No complex recipe trees, no intermediate components.
2. **Ingredient overlap creates dilemmas.** Alcohol + Rag = Medkit OR Molotov. Blade + Binding = Shiv OR Upgraded Melee. You almost always have to choose between two useful items.
3. **Scarcity drives tension.** You never have enough materials to craft everything you want. Every crafting choice is meaningful because resources are genuinely scarce.
4. **Crafting reinforces themes.** Making a weapon from scavenged parts reinforces the survival narrative. The system isn't bolted on; it's integral to the experience.

### Approaches to Crafting Design

From the design literature, five main approaches:

1. **Recipe-based** (The Last of Us, Minecraft): Known recipes, gather ingredients, craft. Simple and clear. Risk: becomes checklist busywork if recipes are too numerous.

2. **Discovery-based** (early Minecraft, some roguelikes): Players experiment by combining items to discover recipes. Rewards curiosity and experimentation. Risk: frustrating if wrong guesses waste rare resources.

3. **Modification-based** (weapon modding in Fallout): Existing items are upgraded or modified rather than built from scratch. Feels more grounded and less abstract. Risk: can become a stat-padding exercise.

4. **Disassembly-based** (Fallout 4/76): Break items down to components, reassemble into new things. Makes junk valuable. Risk: turns the game into a vacuum cleaner simulator.

5. **Contextual** (environment-based crafting): Craft different things depending on where you are or what's happening. A campfire enables cooking, a workbench enables weapon repair. Adds immersion.

### What Makes Recipe Discovery Rewarding?

- **Hints, not manuals.** Don't hand the player a complete recipe book. Drop clues: a journal entry mentions mixing herbs, an NPC describes a technique, examining an item suggests "this could be combined with something sharp."
- **Forgiving experimentation.** If wrong guesses destroy rare materials, players will just look up recipes online. Either make experimentation cheap, or provide strong hints.
- **Visible logic.** Players should be able to intuit recipes: sharp thing + stick = spear. If recipes are arbitrary (flower + rock = bomb), the system feels random.

### Practical Recommendations for SIGNAL

- **2-3 ingredients per recipe** maximum. Keep it simple.
- **Overlapping ingredients** so every crafting decision is a trade-off.
- **Discovery through narrative.** Memory fragments could unlock crafting knowledge. "You remember how to make a water filter" is more engaging than finding a recipe card.
- **Limited recipe list.** 10-15 craftable items total is plenty. Each one should feel meaningfully different.
- **No intermediate components.** Don't require crafting Component A to then craft Item B. Each recipe should go directly from raw materials to useful item.

---

## 5. Difficulty and Balance

### The Core Tension

Survival games need tension to feel like survival. But too much punishment drives players away. The design goal is: **every death should feel like the player's fault, and every survival should feel earned.**

### Death Mechanics: A Spectrum

From the research, death mechanics fall on a spectrum:

**Pure Permadeath (Traditional Roguelike)**
- One life, start over completely on death.
- Creates maximum tension but can feel unfair with bad RNG.
- Works best in short-form games (30-60 min runs) like Slay the Spire.
- Requires extremely fair design: no sudden-death situations, no unavoidable deaths.

**Softened Permadeath (Roguelite)**
- Death resets the run, but some progress persists.
- Hades: permanent upgrades and story progress survive death. Dying never feels wasted.
- Dead Cells: unlock new weapons and abilities across runs.
- Risk of Rain 2: even failed runs yield story progress and upgrades.

**Limited Lives (Middle Ground)**
- Tales of Maj'Eyal: lose one of limited lives on death, continue playing. Gain new lives at level milestones. Maintains roguelike tension with a safety net.
- Works well when lives are scarce enough to feel precious but available enough to prevent frustration.

**Checkpoint/Save Systems (Traditional RPG)**
- Save anywhere or at fixed points. Death costs time, not progress.
- Least tension but most accessible.
- Can be combined with resource loss on death (lose items, lose currency) to add stakes.

### Difficulty Curves

**Dead Cells approach**: Early biomes allow experimentation with minimal pressure. Later areas introduce complex patterns and traps. Deaths are rarely cheap -- mistakes are identifiable and learnable. The balance between fast combat and gradual escalation keeps runs tense yet enjoyable.

**Cogmind approach**: Adjustable difficulty through optional challenges. The base game is completable by most players. Extra objectives and harder paths exist for experts. Players choose their own difficulty by how they play, not through a menu setting.

### Key Principles from the Research

1. **Deaths should be learning opportunities.** If the player doesn't understand why they died, the death feels unfair. Clear cause-and-effect is essential.

2. **Avoid sudden death.** One-shot kills from enemies or traps that couldn't be anticipated are the #1 source of player frustration in permadeath games. Every lethal situation should have warning signs.

3. **Tension comes from scarcity, not punishment.** You don't need permadeath to create tension. Running low on food, having 1 HP, being out of ammo -- these create survival tension naturally.

4. **Early game should be hardest (relatively).** The player has the fewest tools and least knowledge. Front-loading difficulty feels like a "learning curve." Back-loading difficulty (where the endgame is brutally harder than the start) feels like the game is punishing success.

5. **Let the player recover from mistakes.** A single bad decision shouldn't cascade into unavoidable death. Give players tools to recover: healing, escape routes, second chances. The tension should come from the COST of recovery, not its impossibility.

### Practical Recommendations for SIGNAL

- **Soft permadeath** with persistent narrative progress. Death resets the current scenario/area but memory fragments and key story beats persist.
- **Resource scarcity as primary tension.** Low HP, limited supplies, degrading equipment -- these create survival feeling without needing harsh death penalties.
- **Telegraphed danger.** Before lethal encounters, give clear warnings: "The readings spike dangerously. Something massive is nearby."
- **Difficulty through choices, not stats.** The game gets harder because the player pushes into more dangerous territory for better rewards, not because enemies arbitrarily gain +50% HP.
- **No difficulty menu.** The game should have one well-tuned difficulty curve. Optional risks (explore the dangerous ruin for rare loot) let players self-select difficulty.

---

## 6. Progression Systems

### The Progression Paradox

The fundamental challenge: players want to feel more powerful over time, but if they become too powerful, the game loses tension. Every progression system must solve this paradox.

### Vertical vs. Horizontal Progression

**Vertical progression** (increasing stats, bigger numbers): Feels immediately rewarding. Risk: trivializes earlier content. If enemies don't scale, the early game becomes boring on revisit.

**Horizontal progression** (new abilities, new options): Doesn't break difficulty but feels less immediately "powerful." Instead of hitting harder, you can now hit in new ways. Games like Slay the Spire are almost entirely horizontal: you don't get stronger, you get more options.

**The best systems combine both.** Small vertical gains (slightly more HP, slightly better damage) plus meaningful horizontal unlocks (new abilities, new crafting recipes, new dialogue options). Group minor upgrades into meaningful milestones: novice/competent/expert tiers that each unlock new tactical options.

### Pacing Progression

- **1-2 new elements per session** is ideal. More than that overwhelms. Fewer feels stagnant.
- **Milestones over grinding.** Progression should come from achieving things, not repeating things. Completing a quest, surviving a major encounter, discovering a location.
- **Starfield's approach to preventing dump-stats**: Players must complete a challenge using a skill before they can upgrade it further. This forces familiarity with the mechanic before powering it up.

### Skill Trees: What Works

From GDKeys' analysis of meaningful skill trees:

1. **Every node should feel like a reward, not an obligation.** If a skill tree has "filler" nodes you must take to reach the good stuff, the tree has failed.
2. **Choices should be meaningful and permanent** (or very expensive to respec). If you can have everything, nothing matters.
3. **Trees should support different playstyles.** A stealth path, a combat path, a social path -- each should be viable for completing the game.
4. **Visible future unlocks** create anticipation. "I need 2 more points to unlock that ability" is a powerful motivator.

### Diegetic Progression (Narrative-Tied Advancement)

This is directly relevant to SIGNAL's memory-fragment-as-skill-unlock mechanic. Key findings:

**What is diegetic progression?** Character growth tied directly to in-game events and narrative moments, rather than abstract XP accumulation. Your character doesn't get stronger because they killed 50 rats; they get stronger because they remembered how to fight, or found a mentor, or survived a defining moment.

**Why it works:**
- Every advancement feels earned and emerges naturally from the story.
- No grinding -- progression comes from exploration and narrative engagement.
- Creates powerful immersion because there are no "dissociative" mechanics (no XP bars, no arbitrary level-ups).
- Syncs character growth with narrative, making players more connected to their role.

**Implementation approaches:**
- **Milestone-based**: Major story achievements grant abilities. Completing a critical quest unlocks a new skill.
- **Memory recovery**: (directly applicable to SIGNAL) Abilities existed before and are being remembered/recovered. Each memory fragment is both a narrative beat AND a mechanical upgrade. SIPHER uses this exact approach: "Augments are fragments of your character's lost memories. Each collected fragment helps piece together your forgotten identity."
- **Skill discovery through narrative**: Characters don't gain abilities until they justify learning them in the story. A fighter can't learn a new technique until they find someone to teach them or remember it.

### Elden Ring: Nightreign's Memory Fragment System

Nightreign provides a recent example of memory fragments as progression:
- Finding memory fragments unlocks journal chapters for your character.
- At certain chapters, characters begin "Remembrances" -- personal quests that dig deeper into lore.
- Completing remembrances unlocks special Relics that modify skills.
- The system ties exploration, narrative, and mechanical progression into a single loop.

### The Memory-Fragment-as-Skill-Unlock Mechanic (for SIGNAL)

Combining the research, here's how to make this feel rewarding:

1. **Each fragment should be a story moment.** Not just "you found a fragment" but a brief, vivid memory that reveals character history. The player should want to find fragments for the story as much as the mechanical benefit.

2. **Fragments should unlock abilities, not just stats.** "You remember how to hotwire electronics" (unlocks new interaction) is more exciting than "You gain +1 to Technical." Horizontal progression over vertical.

3. **Create a visible "memory map."** Show the player how many fragments exist and how they connect. Blank spaces create curiosity. Filled spaces create satisfaction. The Thought Cabinet from Disco Elysium is a good UI reference.

4. **Some fragments should have trade-offs.** A traumatic memory might unlock a powerful ability but impose a psychological penalty. "You remember the fire. You can now craft incendiary devices, but flames cause panic." This prevents fragments from being pure upgrades and adds character depth.

5. **Gate fragments behind different activities.** Some found through exploration, some through combat, some through dialogue, some through crafting. This rewards varied play rather than optimization of one path.

6. **Limit active fragments.** If 12 fragments can be internalized at once (like Disco Elysium's Thought Cabinet), players must choose which memories define them. This creates replayability and identity.

7. **Fragment research/integration time.** Don't make fragments instantly usable. A brief "integration" period where the memory is being processed (with temporary effects, positive or negative) creates anticipation and pacing.

---

## Summary of Cross-Cutting Principles

These themes appeared across every topic researched:

1. **Simplicity creates depth; complexity creates confusion.** The best systems have few inputs that combine in many ways (Slay the Spire's 3 energy, FTL's 4 resources, Last of Us's 2-ingredient recipes).

2. **Every decision should be a trade-off.** If one option is always best, the system has failed. Crafting medkit vs. molotov, carrying weapon vs. supplies, fighting vs. fleeing.

3. **Scarcity drives engagement.** Players engage with systems when resources are tight. Abundance breeds boredom. "Usually just barely enough" is the target.

4. **Narrative integration elevates mechanics.** A stat isn't just a number; it's a personality trait. A crafting recipe isn't just a combination; it's a remembered skill. A death isn't just a failure; it's a story.

5. **Transparency prevents frustration.** Players should understand why things happen. Telegraphed attacks, visible enemy intent, clear stat effects, logical crafting recipes. Mystery in narrative, clarity in mechanics.

6. **Respect the player's time.** Short combat encounters, limited inventory to prevent hoarding, progression through milestones not grinding. If a system feels like busywork, cut it.

---

## Sources

### Stat Systems
- [RPGs: Designing Stats - GameDev.net](https://www.gamedev.net/forums/topic/602287-rpgs-designing-stats/)
- [Handrolling an RPG Stat System - Written Realms Blog](https://blog.writtenrealms.com/stats/)
- [Three-Stat System - TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/Main/ThreeStatSystem)
- [RPG Stats: Implementing Character Stats - How to Make an RPG](https://howtomakeanrpg.com/r/a/how-to-make-an-rpg-stats.html)
- [Stats: Too Few, Too Many - RPGnet Forums](https://forum.rpg.net/threads/stats-too-few-too-many-and-which-ones.497410/)
- [How Many Attributes is Too Many? - Weight Gaming Forum](https://forum.weightgaming.com/t/how-many-attributes-is-too-many-for-an-rpg/2297)

### Disco Elysium
- [Disco Elysium RPG System Analysis - Gabriel Chauri](https://www.gabrielchauri.com/disco-elysium-rpg-system-analysis/)
- [Disco Elysium RPG System Analysis - Game Design Thinking](https://gamedesignthinking.com/disco-elysium-rpg-system-analysis/)
- [Thought Cabinet - Disco Elysium Wiki](https://discoelysium.fandom.com/wiki/Thought_Cabinet)

### Inventory and Resource Management
- [PC Gaming's Best Inventory System (Neo Scavenger) - PC Gamer](https://www.pcgamer.com/games/survival-crafting/pc-gamings-best-inventory-system-is-hidden-in-this-obscure-post-apocalyptic-roguelike-from-the-dawn-of-the-survival-craze/)
- [Fallout RPG Scavenging - That70sGame](https://that70sgame.wordpress.com/2024/04/24/fallout-rpg-scavenging-1-how-is-it-meant-to-work/)
- [Inventory Management - Caves of Qud Steam Discussions](https://steamcommunity.com/app/333640/discussions/0/1736588252366218361/)

### Turn-Based Combat
- [12 Ways to Improve Turn-Based RPG Combat - Gamedeveloper.com](https://www.gamedeveloper.com/design/12-ways-to-improve-turn-based-rpg-combat-systems)
- [6 More Ways to Improve Turn-Based RPG Combat - Sinister Design](https://sinisterdesign.net/6-more-ways-to-improve-turn-based-rpg-combat-systems/)
- [Combat Systems in Text-Based Games - Choice of Games Forum](https://forum.choiceofgames.com/t/combat-systems-in-text-based-games-yea-or-nay/17864)
- [In What Ways Can a Text Adventure Have Combat? - GameDev.net](https://www.gamedev.net/forums/topic/651039-in-what-ways-can-a-text-adventure-have-combat/)
- [Ultimate Guide to Balancing Turn-Based Combat - TTRPG Games](https://www.ttrpg-games.com/blog/ultimate-guide-to-balancing-turn-based-combat/)

### Slay the Spire and FTL
- [How Slay the Spire's Devs Use Data to Balance - Gamedeveloper.com](https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder)
- [Why Slay the Spire Still Rules - Videogamer](https://www.videogamer.com/features/why-slay-the-spire-still-rules-the-roguelike-deckbuilder-genre/)
- [Best Design 2019: Slay the Spire - PC Gamer](https://www.pcgamer.com/best-design-2019-slay-the-spire/)
- [FTL: Faster Than Light Designer Review - Game Design Strategies](https://gamedesignstrategies.wordpress.com/2012/09/29/ftl-faster-than-light-designer-review/)

### Crafting Systems
- [The Brilliant Crafting System in The Last of Us - SUPERJUMP/Medium](https://medium.com/super-jump/the-brilliant-crafting-system-in-the-last-of-us-bb33f221f2c1)
- [5 Approaches to Crafting Systems in Games - Envato Tuts+](https://code.tutsplus.com/5-approaches-to-crafting-systems-in-games-and-where-to-use-them--cms-22628a)
- [7 Crafting Systems Game Designers Should Study - Gamedeveloper.com](https://www.gamedeveloper.com/design/7-crafting-systems-game-designers-should-study)
- [Crafting in Games - Digital Humanities Quarterly](https://www.digitalhumanities.org/dhq/vol/11/4/000339/000339.html)

### Difficulty and Death Mechanics
- [Adjustable Difficulty - Cogmind/Grid Sage Games](https://www.gridsagegames.com/blog/2017/02/adjustable-difficulty/)
- [Permadeath: The Heart of Roguelike Gameplay - LitRPG Reads](https://litrpgreads.com/blog/permadeath-the-heart-of-roguelike-gameplay)
- [Permadeath - RogueBasin](https://www.roguebasin.com/index.php/Permadeath)
- [Roguelikes That Balance Difficulty Perfectly - Game Rant](https://gamerant.com/roguelikes-with-perfect-difficulty-balance/)
- [Unique Death Mechanics in Roguelikes - Game Rant](https://gamerant.com/roguelike-games-with-unique-death-mechanics-ranked/)

### Progression Systems
- [Keys to Meaningful Skill Trees - GDKeys](https://gdkeys.com/keys-to-meaningful-skill-trees/)
- [Progression Systems: Balancing Fun and Challenge - Minifiniti](https://minifiniti.com/blogs/game-talk/progression-systems-fun-challenge)
- [Game Progression and Progression Systems - Game Design Skills](https://gamedesignskills.com/game-design/game-progression/)
- [Modern RPGs and Skill Progression - Scott Fine Game Design](http://scottfinegamedesign.com/design-blog/2024/1/7/diabloxstarfield)

### Narrative/Diegetic Progression
- [Diegetic Advancement Guide - TTRPG Games](https://www.ttrpg-games.com/blog/design-adventures-the-nsr-way-a-quick-guide-to-diegetic-advancement/)
- [Designing RPGs with Narrative Progression - TTRPG Games](https://www.ttrpg-games.com/blog/designing-rpgs-narrative-progression/)
- [Distributed Narrative Collectables - Gamedeveloper.com](https://www.gamedeveloper.com/design/distributed-narrative-collectables-and-diegetic-choice-field-exploration)

### A Dark Room
- [A Dark Room: Cormac McCarthy of Text-Based Games - Slate](https://slate.com/technology/2014/05/a-dark-room-the-cormac-mccarthy-of-text-based-iphone-games.html)
- [A Dark Room Review - ThatSoftwareDude](https://www.thatsoftwaredude.com/content/1023/a-dark-room-text-game-review)

### Darkest Dungeon
- [Darkest Dungeon: A Design Postmortem - GDC Vault](https://gdcvault.com/play/1023089/Darkest-Dungeon-A-Design)
- [The Dynamics of Stress in Darkest Dungeon - Nicola Dau](https://nicolaluigidau.wordpress.com/2024/02/06/the-dynamics-of-stress-in-darkest-dungeon/)
- [A Mechanical Critique of Darkest Dungeon - The Gemsbok](https://thegemsbok.com/art-reviews-and-articles/darkest-dungeon-red-hook-critique-mechanics-design/)

### Caves of Qud and Dwarf Fortress
- [Dwarf Fortress and Caves of Qud Roundtable - PC Gamer](https://www.pcgamer.com/dwarf-fortress-and-caves-of-qud-roundtable-the-masters-of-simulation-talk-roguelikes-ai-and-making-the-infinite-compelling/)
- [Tapping into Procedural Generation in Caves of Qud - Gamedeveloper.com](https://www.gamedeveloper.com/design/tapping-into-the-potential-of-procedural-generation-in-caves-of-qud)
