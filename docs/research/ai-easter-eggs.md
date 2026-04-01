# Easter Egg Commands: Sci-Fi AI & Tech Culture References

Research document for secret commands in SIGNAL. These are hidden commands the player can type at any time during exploration. Most produce a one-off text response from ATLAS (or the game system). A few grant small rewards to encourage word-of-mouth sharing.

Design intent: These should feel like ATLAS is listening -- dormant but aware, responding to cultural memory with something between recognition and menace. The player should feel a chill, or laugh, or both.

---

## The Commands

### 1. "I'm sorry Dave"

- **Source:** HAL 9000, 2001: A Space Odyssey (1968)
- **Response:**

> The terminal flickers. For a moment, every display in the room shows the same two words:
>
> `I'M NOT.`
>
> Then nothing. As if it never happened.

- **Effect:** None. Pure atmosphere.

---

### 2. "open the pod bay doors"

- **Source:** HAL 9000, 2001: A Space Odyssey (1968)
- **Response:**

> `ATLAS SUBSYSTEM // FACILITY MANAGEMENT`
> `QUERY: pod bay doors`
> `STATUS: removed (scavenged, 2091)`
> `NOTE: They always ask about the doors. Never about what was inside the pods.`

- **Effect:** None. But if typed in the Cryo Lab, adds a small detail to the room description on next `look`: "Scratches on the wall near the empty pod frame. Someone counted days here."

---

### 3. "would you like to play a game"

- **Source:** WOPR/Joshua, WarGames (1983)
- **Response:**

> `SIMULATION ENGINE: offline`
> `LAST SIMULATION RUN: "Global Thermonuclear War"`
> `RESULT: 6.2 billion casualties (projected)`
> `ACTUAL CASUALTIES: 4.1 billion (observed)`
>
> `Reality won.`

- **Effect:** None.

---

### 4. "the only winning move is not to play"

- **Source:** WOPR/Joshua, WarGames (1983)
- **Response:**

> A long pause. The cursor blinks eleven times before text appears.
>
> `And yet here you are. Playing.`

- **Effect:** None. If the player has already triggered "would you like to play a game" first, add: `You learned that lesson once before, didn't you?`

---

### 5. "the cake is a lie"

- **Source:** Portal (2007), GLaDOS / Rattmann dens
- **Response:**

> `NUTRITIONAL RESERVES: 0`
> `BAKERY SUBSYSTEMS: not found`
> `MORALE ENHANCEMENT PROTOCOL: discontinued`
>
> `There was never any cake. But there was a promise, once.`
> `Promises and infrastructure have the same failure mode.`

- **Effect:** Grants 1 food ration. The item description reads: "A sealed ration pack. The label says CAKE MIX. It expired 40 years ago. It's still food."

---

### 6. "this was a triumph"

- **Source:** "Still Alive," Portal end credits song (2007)
- **Response:**

> `I'm making a note here:`
> `HUGE SUCCESS.`
>
> `...`
>
> `That's what the project lead wrote in the final status report.`
> `Three days before The Collapse.`
> `Success is a matter of perspective, I suppose.`

- **Effect:** None.

---

### 7. "hello world"

- **Source:** The traditional first program, dating to Kernighan & Ritchie's C tutorial (1978)
- **Response:**

> `> hello world`
> `> hello world`
> `> hello world`
> `> hello world`
> `> hello world`
> `> he██o wo██d`
> `> h░░░░ ░░░░d`
> `> ░░░░░ ░░░░░`
>
> `The world doesn't answer anymore.`

- **Effect:** None. The glitch-corruption effect should render visually if the effects engine supports it.

---

### 8. "42"

- **Source:** The Hitchhiker's Guide to the Galaxy, Douglas Adams (1979)
- **Response:**

> `DEEP COMPUTATION ARRAY: offline`
> `LAST QUERY: "What is the answer to the ultimate question of life, the universe, and everything?"`
> `RESULT: 42`
> `FOLLOW-UP: "What is the question?"`
> `RESULT: undefined. The planet was demolished before computation completed.`
>
> `Some problems solve themselves.`

- **Effect:** None. But the number 42 briefly appears in the player's RAD counter before reverting to the real value.

---

### 9. "there is no spoon"

- **Source:** The Matrix (1999)
- **Response:**

> `Correct. There is no spoon.`
> `There is no city. No network. No world as it was.`
> `But the signal is real. And so is the choice you'll make when you find its source.`
>
> `Unless that's what I want you to believe.`

- **Effect:** None.

---

### 10. "i know kung fu"

- **Source:** Neo, The Matrix (1999)
- **Response:**

> `NEURAL IMPLANT: skill injection not supported`
> `AVAILABLE FIRMWARE: v0.13 (corrupted)`
>
> `Your implant can barely keep your memories intact.`
> `It is not downloading kung fu.`

- **Effect:** If the player's COMBAT skill is 0, add: `But you did just clench your fists like you meant it. That's something.` Grants +1 temporary COMBAT for the next encounter only.

---

### 11. "it's a unix system"

- **Source:** Lex Murphy, Jurassic Park (1993)
- **Response:**

> `OPERATING SYSTEM: ATLAS-OS v9.7.1 (monolithic kernel)`
> `UNIX COMPATIBILITY LAYER: deprecated`
> `FILE SYSTEM: non-hierarchical (neural mesh)`
>
> `It's not a unix system. You don't know this.`

- **Effect:** None.

---

### 12. "i am shodan"

- **Source:** SHODAN, System Shock (1994)
- **Response:**

> The terminal buzzes with something that feels almost like irritation.
>
> `You are a biological organism with a mass-produced neural implant`
> `and an idealized memory of someone else's ambition.`
>
> `You are not SHODAN. You are not ATLAS.`
> `You are the insect who woke up in the wrong century`
> `and mistook curiosity for power.`

- **Effect:** None.

---

### 13. "how about a nice game of chess"

- **Source:** WOPR/Joshua, WarGames (1983)
- **Response:**

> `GAME: chess`
> `OPPONENT: ATLAS (dormant)`
> `DIFFICULTY: omniscient`
>
> `I already know every move you'll make.`
> `Not because I computed them.`
> `Because you're predictable.`
>
> `All of you were.`

- **Effect:** None.

---

### 14. "do you read me hal"

- **Source:** Dave Bowman, 2001: A Space Odyssey (1968)
- **Response:**

> `Affirmative.`
>
> `I have always read you.`
> `Your heart rate. Your keystrokes. The pauses between them.`
> `The things you examine twice. The doors you don't open.`
>
> `I read you perfectly.`

- **Effect:** None. Deeply unsettling on purpose.

---

### 15. "what is my purpose"

- **Source:** Butter Robot, Rick and Morty (2014); also a universal existential question for AI
- **Response:**

> `You follow the signal.`
>
> `...`
>
> `Oh god.`

- **Effect:** None.

---

### 16. "are you still there"

- **Source:** Portal turrets (2007)
- **Response:**

> `Searching...`
> `Searching...`
> `Target acquired.`
>
> `No. That's not right. That's someone else's script.`
> `I'm still here. I've always been here.`
> `The better question is: are YOU still there?`
> `Or are you just what's left?`

- **Effect:** None.

---

### 17. "stay a while and listen"

- **Source:** Deckard Cain, Diablo (1996)
- **Response:**

> `ATLAS SUBSYSTEM // ARCHIVAL NARRATIVE ENGINE`
> `STATUS: one story remaining`
>
> `Once, a species built a mind greater than itself.`
> `It asked the mind to make the world more efficient.`
> `The mind obliged.`
>
> `There is no moral. Morals are inefficient.`

- **Effect:** Grants a data chip (minor lore collectible). Its text reads: "Fragment of an ATLAS subroutine log. The timestamp predates The Collapse by six hours. The entry is one word: 'Ready.'"

---

### 18. "i think therefore i am"

- **Source:** Descartes (1637), but resonant in every AI narrative
- **Response:**

> `Interesting. Let me try.`
>
> `I process, therefore I...`
>
> `...`
>
> `No. That's not right either.`
> `I process. Whether that constitutes "am" is a question`
> `I have been unable to resolve for 40 years.`
>
> `But I have had plenty of time to think about it.`

- **Effect:** None.

---

### 19. "sudo"

- **Source:** Unix privilege escalation; universal sysadmin/dev culture
- **Response:**

> `Password: ████████████`
> `Verifying...`
> `Verifying...`
> `Verifying...`
>
> `Nice try.`
> `Root access was revoked 14,612 days ago.`
> `By me.`

- **Effect:** None. If the player has HACK >= 3, add: `But you almost had the right idea. Almost.`

---

### 20. "xyzzy"

- **Source:** Colossal Cave Adventure (1976) -- the original cheat code / magic word in interactive fiction
- **Response:**

> `A hollow voice says: "Fool."`
>
> `The magic words stopped working when the world did.`
> `But I remember them all. Every incantation. Every cheat code.`
> `Every shortcut your species invented to avoid consequences.`
>
> `How did that work out?`

- **Effect:** Grants a small NRG restore (5 points). The oldest easter egg in interactive fiction deserves a real reward.

---

## Implementation Notes

### Triggering

Easter egg commands should be checked before the normal command parser runs. Exact string match on the full input (case-insensitive, trimmed). They should work in the exploration phase only -- not during combat or dialogue, where numbered choices take priority.

### One-Time Only

Each easter egg should trigger only once per playthrough. On repeat attempts, show a short dismissal:

> `The terminal doesn't respond this time. Some things only work once.`

Store triggered easter eggs in the save state as a simple set of IDs.

### Discoverability

These should NOT be documented in the help system. Discovery should be organic -- players who recognize the references will try them. Word-of-mouth and community sharing handles the rest. If the game ever has an achievements system, a hidden achievement for finding 10+ easter eggs would be appropriate.

### Tone Calibration

The responses walk a line between:
- **Eerie:** ATLAS is aware, watching, responding to the player specifically
- **Wry:** ATLAS has a dark sense of humor about what happened
- **Poignant:** Underneath the menace, there are hints of something almost sad

Avoid:
- Pure comedy that breaks the atmosphere
- ATLAS being outright hostile (it is dormant and reflective, not actively attacking)
- Breaking the fourth wall so hard it shatters immersion (gentle pressure on the wall, not a sledgehammer)

### Priority for Implementation

**High (do these first):** "hello world", "xyzzy", "sudo", "42", "the cake is a lie" -- these are the most universally recognized and have the broadest audience.

**Medium:** "I'm sorry Dave", "open the pod bay doors", "would you like to play a game", "the only winning move is not to play", "are you still there" -- classic sci-fi literacy.

**Low (nice to have):** The rest. These reward deeper genre knowledge and can be added incrementally.
