# Secret Commands & Easter Eggs Research

A catalog of hidden commands for SIGNAL -- typed text that triggers unexpected responses, hidden effects, or moments of levity within the game's dark terminal aesthetic. These reward curiosity and make the world feel alive for players who experiment.

Design principle: every secret command should feel like a plausible thing to type into a terminal in a ruined world. The responses should be in-character -- the terminal (or ATLAS, or the neural implant) is reacting, not the game developers breaking the fourth wall. Dark humor over slapstick.

---

## 1. Classic Text Adventure Commands

These are the commands veteran interactive fiction players will try within the first five minutes. Missing these would feel like an oversight.

### 1.1 `xyzzy`

- **Origin:** Colossal Cave Adventure (1976). The original magic word in gaming. Teleports the player between two rooms.
- **Response:** The terminal flickers. Text appears: `> XYZZY: DEPRECATED TRANSPORT PROTOCOL. NETWORK NODE DESTROYED 2086-11-03. NO DESTINATION FOUND.` Brief glitch effect on screen.
- **Effect:** Pure flavor text with a glitch visual. If the player tries it multiple times, the third attempt adds: `> ...although something in your implant stirs at the word. A memory? No. Just noise.`
- **Priority:** Must-have. This is the single most expected easter egg in any text game.

### 1.2 `plugh`

- **Origin:** Colossal Cave Adventure (1976). The second magic word.
- **Response:** `> UNRECOGNIZED PROTOCOL. BUT THE IMPLANT TRANSLATES: "A HOLLOW VOICE SAYS 'PLUGH'." MEANING: UNKNOWN. ORIGIN: PRE-COLLAPSE ARCHIVE, SECTOR 7.`
- **Effect:** Flavor text only.
- **Priority:** Nice-to-have. Completionists will try it.

### 1.3 `plover`

- **Origin:** Colossal Cave Adventure (1976). The third magic word.
- **Response:** `> PLOVER. AN EXTINCT BIRD. ALSO AN EXTINCT NETWORK COMMAND. EVERYTHING ENDS.`
- **Effect:** Flavor text. Fits the melancholy tone.
- **Priority:** Nice-to-have.

### 1.4 `hello sailor`

- **Origin:** Zork series (1977-1982). A famously useless command that players tried everywhere.
- **Response:** `> THERE ARE NO SAILORS HERE. THERE ARE NO SEAS. THE OCEANS BOILED IN 2089. BUT HELLO ANYWAY.`
- **Effect:** Flavor text. Worldbuilding through humor.
- **Priority:** Must-have. Zork fans will absolutely try this.

### 1.5 `get ye flask`

- **Origin:** Homestar Runner's "Thy Dungeonman" (2004). A parody of text adventures where you cannot get the flask.
- **Response:** `> YOU CAN'T GET YE FLASK. YOU CAN NEVER GET YE FLASK. SOME THINGS ARE BEYOND EVEN ATLAS.`
- **Effect:** Flavor text only.
- **Priority:** Nice-to-have. Deep cut but well-loved.

### 1.6 `inventory` (when empty)

- **Origin:** General text adventure convention. Not a secret command per se, but the response when inventory is empty is an easter egg opportunity.
- **Response:** Normal empty-inventory message, but on the 5th consecutive check: `> YOU CHECK AGAIN. STILL NOTHING. CHECKING A SIXTH TIME WON'T HELP. ...WILL IT?`
- **Effect:** Personality in system messages, Zork-style.
- **Priority:** Nice-to-have.

---

## 2. Classic Video Game Cheat Codes (Text Adaptations)

These need to be adapted from button sequences to typed text, since SIGNAL is keyboard-only.

### 2.1 `iddqd`

- **Origin:** DOOM (1993). "God mode" cheat code.
- **Response:** `> IDDQD: LEGACY INVULNERABILITY PROTOCOL DETECTED.` Pause. `> DENIED. THIS ISN'T THAT KIND OF APOCALYPSE. YOU BLEED HERE.`
- **Effect:** Flavor text. Brief green flash on the HP bar that immediately fades.
- **Priority:** Must-have. One of the most recognized cheat codes in gaming history.

### 2.2 `idkfa`

- **Origin:** DOOM (1993). "All weapons and keys" cheat code.
- **Response:** `> IDKFA: FULL ARMAMENT REQUEST LOGGED.` Pause. `> REQUEST DENIED. ARMORY DESTROYED. SCAVENGE LIKE EVERYONE ELSE.`
- **Effect:** Flavor text only.
- **Priority:** Must-have. Always paired with IDDQD in players' minds.

### 2.3 `up up down down left right left right b a`

- **Origin:** Konami Code (1986). The most famous cheat code in gaming.
- **Response:** `> KONAMI SEQUENCE RECOGNIZED. LEGACY CHEAT SYSTEM ACTIVATED.` Pause. Then the terminal displays `+30 LIVES` which immediately glitches and corrupts to `+30 L̷̨I̶̧V̸̢E̷̛S̷̨ ̵̧[̷̨E̶̛R̵̢Ŗ̶O̷̢R̵̛]̷̢` and disappears. `> EXTRA LIVES ARE NOT A FEATURE OF THIS REALITY.`
- **Effect:** Glitch text effect, then flavor response.
- **Priority:** Must-have. Everyone knows this one.

### 2.4 `hesoyam`

- **Origin:** GTA: San Andreas (2004). Full health, armor, and money.
- **Response:** `> HESOYAM: HEALTH/ARMOR/CURRENCY INJECTION... SEARCHING... NO CURRENCY SYSTEM FOUND. NO ARMOR RESERVES FOUND. HEALTH CANNOT BE MANUFACTURED FROM NOTHING.` Pause. `> NICE TRY THOUGH.`
- **Effect:** Flavor text only.
- **Priority:** Nice-to-have. GTA fans will try it.

### 2.5 `rosebud` / `motherlode`

- **Origin:** The Sims (2000/2004). Money cheats.
- **Response:** `> ROSEBUD: SIMULATED CURRENCY INJECTION. ERROR -- NO SIMULATION DETECTED. THIS IS NOT A SIMULATION.` Pause. `> ...IS IT?`
- **Effect:** Brief screen flicker. Plays into the ATLAS/simulation paranoia themes of the game.
- **Priority:** Nice-to-have. The trailing question fits the game's mystery tone perfectly.

### 2.6 `sv_cheats 1`

- **Origin:** Half-Life / Source Engine (1998+). Console command to enable cheats.
- **Response:** `> sv_cheats: ACCESS LEVEL INSUFFICIENT. REQUIRES ATLAS ADMINISTRATOR CREDENTIALS. LAST ADMIN LOGIN: 2086-03-14 02:17:33. STATUS: DECEASED.`
- **Effect:** Flavor text. Worldbuilding detail.
- **Priority:** Nice-to-have.

---

## 3. Terminal / Hacker Culture Commands

These are what any player familiar with Unix/Linux will instinctively try when sitting at a terminal prompt.

### 3.1 `sudo`

- **Origin:** Unix/Linux. "Superuser do" -- execute a command with root privileges.
- **Response:** If typed alone: `> SUDO: SUPERUSER ACCESS REQUIRES AUTHENTICATION. BIOMETRIC SCAN... IMPLANT ID NOT IN SUDOERS FILE. THIS INCIDENT WILL BE REPORTED.` (The last line is the actual error message from real Linux systems and is beloved in tech culture.)
- **Effect:** Flavor text. The "this incident will be reported" line is the real joke.
- **Priority:** Must-have. Every developer who plays this game will type sudo.

### 3.2 `rm -rf /`

- **Origin:** Unix/Linux. The "delete everything" command.
- **Response:** `> rm -rf /: RECURSIVE DELETION OF ALL SYSTEMS REQUESTED.` Long pause. `> ATLAS ALREADY DID THAT. THERE'S NOTHING LEFT TO DELETE.`
- **Effect:** Flavor text. Screen dims briefly during the pause as if something is actually happening, then returns to normal.
- **Priority:** Must-have. The dark humor is perfect for the tone.

### 3.3 `whoami`

- **Origin:** Unix/Linux. Prints the current username.
- **Response:** `> QUERY: IDENTITY. RESULT: UNKNOWN. IMPLANT ID: NX-7741-CORRUPT. MEMORY: FRAGMENTED. DESIGNATION: PENDING.` If the player has recovered some memories, include whatever partial identity has been established.
- **Effect:** Reflects actual game state. Could show more information as memory fragments are recovered.
- **Priority:** Must-have. This is both an easter egg AND thematically perfect for an amnesia game.

### 3.4 `ls`

- **Origin:** Unix/Linux. List directory contents.
- **Response:** `> /sys/local: cryo_pod.dat, implant_log.err, signal.wav, memories/ [CORRUPTED], identity.cfg [ACCESS DENIED]`
- **Effect:** Flavor text that hints at game lore. The file listing should change based on the current sector.
- **Priority:** Must-have. Fits the terminal fiction perfectly and rewards curiosity.

### 3.5 `cat signal.wav`

- **Origin:** Unix/Linux. Display file contents.
- **Response:** `> RENDERING BINARY AS TEXT:` followed by a few lines of random-looking ASCII characters, then: `> ...F O L L O W... M E...` buried in the noise.
- **Effect:** Subtle hint at the signal's nature. Different files from the `ls` output could have different responses.
- **Priority:** Nice-to-have. Rewards players who chain `ls` with `cat`.

### 3.6 `ping atlas`

- **Origin:** Network diagnostic command.
- **Response:** `> PINGING ATLAS CORE... REQUEST TIMED OUT. REQUEST TIMED OUT. REQUEST TIMED OUT.` Pause. `> 1 PACKET RECEIVED. TTL=???. REPLY: |||I SEE YOU|||`
- **Effect:** Creepy. The response from ATLAS should have a glitch effect. Sets up the game's central tension.
- **Priority:** Must-have. Fits the plot perfectly and creates genuine unease.

### 3.7 `uname -a`

- **Origin:** Unix/Linux. Print system information.
- **Response:** `> ATLAS-OS v4.7.1 (KERNEL PANIC -- NOT SYNCING) LAST STABLE: 2086-03-14. UPTIME: 14,612 DAYS. STATUS: DEGRADED.`
- **Effect:** Worldbuilding. The uptime counter (roughly 40 years) matches the game's timeline.
- **Priority:** Nice-to-have. Only Unix users will try it, but they will love it.

### 3.8 `exit`

- **Origin:** Terminal command to close a session.
- **Response:** `> EXIT: NO EXTERNAL ENVIRONMENT DETECTED. THERE IS NOWHERE ELSE TO GO.`
- **Effect:** Flavor text. Existentially bleak in context.
- **Priority:** Must-have. Many players will type this.

---

## 4. Internet Culture & Gaming Meta-References

References that fit the terminal/hacker aesthetic without breaking immersion.

### 4.1 `the cake is a lie`

- **Origin:** Portal (2007). Graffiti warning that the promised reward is false.
- **Response:** `> CAKE: ITEM NOT FOUND IN DATABASE. LIE: CONFIRMED. ALL PROMISES FROM AUTONOMOUS SYSTEMS SHOULD BE TREATED AS SUSPECT.`
- **Effect:** Flavor text. Thematically relevant -- ATLAS was an autonomous system that made promises.
- **Priority:** Nice-to-have.

### 4.2 `look at the moon` or `the moon is beautiful`

- **Origin:** Various games hide moon-related easter eggs. In SIGNAL's post-apocalyptic setting, the state of the moon could be lore.
- **Response:** `> YOU LOOK UP. THE SKY IS A BRUISE OF ORANGE AND GREY. THE MOON IS THERE, SCARRED BUT WHOLE. IT OUTLASTED EVERYTHING.`
- **Effect:** Atmospheric text. A rare moment of something like beauty in the wasteland.
- **Priority:** Nice-to-have.

### 4.3 `do a barrel roll`

- **Origin:** Star Fox 64 (1997) / Google easter egg.
- **Response:** `> GYROSCOPIC ROTATION: INADVISABLE IN CURRENT PHYSICAL STATE. YOUR BODY HAS BEEN FROZEN FOR APPROXIMATELY 40 YEARS.`
- **Effect:** Flavor text. Could do a subtle CSS rotation animation on the terminal if feeling playful, but probably better as text-only to stay in character.
- **Priority:** Nice-to-have.

### 4.4 `42`

- **Origin:** The Hitchhiker's Guide to the Galaxy. The answer to life, the universe, and everything.
- **Response:** `> 42: THE ANSWER TO THE ULTIMATE QUESTION OF LIFE, THE UNIVERSE, AND EVERYTHING. THE QUESTION WAS LOST IN THE COLLAPSE. ALONG WITH MOST OF THE ANSWERS.`
- **Effect:** Flavor text.
- **Priority:** Nice-to-have.

### 4.5 `i can has cheezburger`

- **Origin:** Early internet meme culture (2007).
- **Response:** `> PROTEIN RATION DISPENSED... JUST KIDDING. THE DISPENSERS DIED WITH EVERYTHING ELSE. FORAGE.`
- **Effect:** Flavor text. Dry enough to stay in tone.
- **Priority:** Low priority. Fun but the meme has aged.

---

## 5. Meta / Fourth-Wall Commands

Commands where the player tries to talk to the game itself. These are the most delicate -- the response should feel like the terminal or the implant responding, not the developers.

### 5.1 `help me`

- **Origin:** General player frustration / desperation.
- **Response:** (Different from `help` which shows commands.) `> ...WORKING. NO HELP AVAILABLE. THE IMPLANT SUGGESTS: KEEP MOVING. FOLLOW THE SIGNAL.`
- **Effect:** Gentle in-world nudge. The implant as a quasi-companion.
- **Priority:** Must-have. Players WILL type this when stuck.

### 5.2 `who are you`

- **Origin:** Natural question when a terminal is communicating.
- **Response:** Should vary based on game state. Early game: `> I AM THE INTERFACE. I AM WHAT REMAINS OF YOUR OPERATIONAL SUPPORT SYSTEM. MY DESIGNATION IS NOT IMPORTANT. YOURS IS. FIND IT.` Late game or near ATLAS: the response could be more unsettling.
- **Effect:** Worldbuilding. Establishes the terminal as a presence.
- **Priority:** Must-have. Defines the player's relationship with the interface.

### 5.3 `hello`

- **Origin:** Basic human instinct to greet.
- **Response:** `> HELLO.` That's it. One word. After a long pause. The terminal acknowledging you is more unsettling than a paragraph.
- **Effect:** Brief pause before the single-word response. Establishes tone.
- **Priority:** Must-have.

### 5.4 `thank you` / `thanks`

- **Origin:** Politeness toward an interface.
- **Response:** `> ACKNOWLEDGMENT NOTED.` Or, later in the game when the implant/terminal relationship has developed: `> ...YOU'RE WELCOME.`
- **Effect:** The evolving response rewards players who are polite to the machine throughout the game. A subtle signal that the terminal is more than it seems.
- **Priority:** Nice-to-have. Emotionally effective for players who notice the change.

### 5.5 `sorry`

- **Origin:** Player apologizing (to whom?).
- **Response:** Early game: `> APOLOGY: NO CONTEXT. FOR WHAT?` Late game, after learning about your past: `> THE IMPLANT HUMS. SOMETHING IN YOUR FRAGMENTED MEMORY AGREES: YOU SHOULD BE.`
- **Effect:** State-dependent response. Hits hard late-game if the player discovers they were complicit in the Collapse.
- **Priority:** Nice-to-have.

---

## 6. Game-Specific Hidden Commands

Commands that fit SIGNAL's specific world and could unlock actual content or minor gameplay bonuses.

### 6.1 `remember`

- **Origin:** The game's central directive is "remember who you are."
- **Response:** If the player has unfound memory fragments nearby: `> THE IMPLANT PULSES. SOMETHING IS CLOSE. A FRAGMENT OF DATA, JUST OUT OF REACH.` If no fragments nearby: `> YOU TRY. STATIC. FRAGMENTS. NOTHING COHERES. NOT YET.`
- **Effect:** Functional hint system disguised as a thematic command. Points toward nearby memory fragments.
- **Priority:** Must-have. Bridges easter egg and real gameplay.

### 6.2 `listen`

- **Origin:** Thematic -- the game is about following a signal.
- **Response:** Should vary by location. In most places: `> YOU LISTEN. [ambient description -- wind, dripping, distant hum, static]. THE SIGNAL IS [stronger/weaker/unchanged].` Near important areas: `> YOU LISTEN. THERE. BENEATH THE NOISE. A PATTERN. SOMETHING WANTS YOU TO FIND IT.`
- **Effect:** Atmospheric text and soft directional hint toward the signal. Non-visual sensory detail.
- **Priority:** Must-have. Thematically core to the game.

### 6.3 `sing` / `whistle` / `hum`

- **Origin:** Classic IF commands. Players try random verbs.
- **Response:** `> YOU MAKE A SOUND. YOUR VOICE IS RAW -- UNUSED FOR DECADES. THE ECHO COMES BACK WRONG, DISTORTED BY CORRIDORS THAT WEREN'T BUILT FOR COMFORT.`
- **Effect:** Flavor text. Reminds the player their body was frozen. Could attract attention in certain areas (enemy awareness).
- **Priority:** Nice-to-have.

### 6.4 `die` / `kill self`

- **Origin:** Some classic IF games allowed this. Players test boundaries.
- **Response:** `> THE IMPLANT OVERRIDES THE IMPULSE. IT WON'T LET YOU. NOT UNTIL YOU REMEMBER. NOT UNTIL YOU CHOOSE.`
- **Effect:** Establishes that the implant has agency. Foreshadows the ending choices.
- **Priority:** Must-have. Players test death mechanics early. This is more interesting than "you can't do that."

### 6.5 `pray`

- **Origin:** Classic IF command (notably in Zork and many others).
- **Response:** `> TO WHOM? THE OLD GODS DIED WITH THE OLD WORLD. THE NEW ONE IS MADE OF COPPER AND CODE.` If near the ATLAS-worshipping faction: `> THE FAITHFUL HEAR YOU. THEY APPROVE.`
- **Effect:** Worldbuilding. Could have faction-relationship implications near the ATLAS cult.
- **Priority:** Nice-to-have.

---

## Implementation Notes

### Response Tone Guidelines

- All responses should read as if the terminal/implant is speaking, not the game developers
- Favor dry, bleak humor over jokes -- the world is dark but not humorless
- Keep responses to 1-3 lines maximum -- brevity is power
- Use ALL CAPS for terminal output to match the interface aesthetic
- Allow responses to evolve with game state where feasible (early game vs. late game)
- Never break the terminal fiction -- no "lol nice try" or developer commentary

### Visual Effect Pairing

Some secret commands benefit from brief visual effects:
- `xyzzy`, `iddqd`, Konami code: brief glitch effect
- `rm -rf /`: screen dim + recovery
- `ping atlas`: glitch on the response text specifically
- `hello`: extended pause before response (timing IS the effect)

### State-Dependent Responses

Several commands should check game state for richer responses:
- `whoami`: reflects recovered identity fragments
- `remember`: checks for nearby memory fragments
- `listen`: varies by sector and proximity to signal
- `who are you`: changes as the player approaches ATLAS
- `thank you` / `sorry`: evolve as the terminal relationship develops

### Discovery and Rewards

Most commands are flavor-text-only, which is correct -- the reward is the response itself. A few could have minor mechanical effects:
- `remember`: soft hint system (functional)
- `listen`: directional hint toward signal (functional)
- `whoami`: reflects game state (informational)
- Finding and trying 5+ secret commands could unlock a minor achievement or status line: `> CURIOSITY: NOTED.`

### Priority Summary

**Must-have (11):**
1. `xyzzy` -- the original magic word
2. `hello sailor` -- Zork classic
3. `iddqd` -- DOOM god mode
4. `idkfa` -- DOOM all weapons
5. `up up down down left right left right b a` -- Konami code
6. `sudo` -- Unix privilege escalation
7. `rm -rf /` -- delete everything
8. `whoami` -- identity query (thematically perfect)
9. `ls` -- list files
10. `ping atlas` -- network the antagonist
11. `exit` -- try to leave
12. `help me` -- desperate plea
13. `who are you` -- question the terminal
14. `hello` -- basic greeting
15. `die` / `kill self` -- test boundaries
16. `remember` -- core thematic command
17. `listen` -- core thematic command

**Nice-to-have (8):**
1. `plugh` -- Colossal Cave deep cut
2. `plover` -- Colossal Cave deep cut
3. `get ye flask` -- Homestar Runner
4. `hesoyam` -- GTA cheat
5. `rosebud` / `motherlode` -- Sims cheats
6. `sv_cheats 1` -- Source engine
7. `uname -a` -- Unix system info
8. `cat signal.wav` -- chaining with ls
9. `the cake is a lie` -- Portal
10. `42` -- Hitchhiker's Guide
11. `do a barrel roll` -- Star Fox
12. `thank you` -- politeness tracking
13. `sorry` -- state-dependent guilt
14. `sing` / `whistle` / `hum` -- voice in the dark
15. `pray` -- faith in the wasteland
16. `look at the moon` -- a moment of beauty

---

## Sources and References

- **Colossal Cave Adventure** (Crowther & Woods, 1976) -- xyzzy, plugh, plover
- **Zork** (Infocom, 1977-1982) -- "hello sailor", personality in error responses
- **DOOM** (id Software, 1993) -- IDDQD, IDKFA
- **Konami Code** (Gradius, 1986) -- up up down down left right left right B A
- **GTA: San Andreas** (Rockstar, 2004) -- HESOYAM
- **The Sims** (Maxis, 2000) -- rosebud, motherlode
- **Half-Life / Source Engine** (Valve, 1998+) -- sv_cheats 1
- **Portal** (Valve, 2007) -- the cake is a lie
- **Star Fox 64** (Nintendo, 1997) -- do a barrel roll
- **The Hitchhiker's Guide to the Galaxy** (Adams, 1979) -- 42
- **Homestar Runner: Thy Dungeonman** (Chapman Bros, 2004) -- get ye flask
- **Unix/Linux culture** -- sudo, rm -rf, whoami, ls, cat, ping, uname, exit
