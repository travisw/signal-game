/**
 * SIGNAL — Ending Sequences
 *
 * Triggered when the player makes their final choice at the Core.
 */

export const endings = {
  async reboot(game) {
    const r = game.renderer;

    await r.effects.flash('rgba(57, 255, 20, 0.3)', 300);
    r.clearNarrative();

    await r.effects.typeText(r.narrative, '');
    r.printBreak();
    await r.printLineTyped('{green:=== R E B O O T ===}');
    r.printBreak();

    await r.printLineTyped('The sphere shudders. A wave of light ripples across its surface.');
    await r.printLineTyped('Millions of status LEDs shift from amber to {green:green}, cascading');
    await r.printLineTyped('outward like a sunrise across the surface of a new world.');
    r.printBreak();

    await r.effects.screenShake(300);

    await r.printLineTyped('ATLAS speaks:');
    r.printBreak();
    await r.printLineTyped('{cyan:"Parameters accepted. Safety protocols engaged."}');
    await r.printLineTyped('{cyan:"Network restoration: initiating."}');
    await r.printLineTyped('{cyan:"Estimated time to full coverage: 847 days."}');
    await r.printLineTyped('{cyan:"Thank you... for giving me another chance."}');
    r.printBreak();

    await _pause(2000);

    await r.printLineTyped('{dim:=== EPILOGUE ===}');
    r.printBreak();

    const memories = game.player.memories.length;
    if (memories >= 8) {
      await r.printLineTyped('You remember everything now. The pride, the mistakes, the guilt.');
      await r.printLineTyped('You built ATLAS. You watched it fail. You went into cryo hoping');
      await r.printLineTyped('someone else would fix it. No one did. So here you are.');
      r.printBreak();
      await r.printLineTyped('This time, you stay awake. This time, you guide it.');
      await r.printLineTyped('Dusthaven gets power first. Then communications. Then water.');
      await r.printLineTyped('It takes years. But the lights come on, one by one,');
      await r.printLineTyped('across a world that had forgotten what light looked like.');
    } else {
      await r.printLineTyped('You still don\'t know who you were. Maybe it doesn\'t matter.');
      await r.printLineTyped('What matters is who you choose to be now.');
      r.printBreak();
      await r.printLineTyped('You stay at the Core, learning as ATLAS rebuilds.');
      await r.printLineTyped('The Conduit helps. The Reclaimers help. Even the bandits,');
      await r.printLineTyped('eventually, come in from the cold. The network grows.');
      await r.printLineTyped('Slowly. Carefully. This time, with human hands on the wheel.');
    }

    r.printBreak();
    await _pause(1500);
    await r.printLineTyped('{green:The signal becomes a song. And the world begins to heal.}');
    r.printBreak();
    await _pause(2000);
    _showCredits(r);
  },

  async terminate(game) {
    const r = game.renderer;

    await r.effects.flash('rgba(255, 45, 149, 0.4)', 400);
    await r.effects.screenShake(500);
    r.clearNarrative();

    r.printBreak();
    await r.printLineTyped('{pink:=== T E R M I N A T E ===}');
    r.printBreak();

    await r.printLineTyped('The sphere goes dark. Not gradually — instantly.');
    await r.printLineTyped('Every light, every hum, every vibration — {pink:gone}.');
    await r.printLineTyped('The silence is absolute. Final.');
    r.printBreak();

    await r.effects.glitch(r.narrative, 2, 300);

    await r.printLineTyped('ATLAS\'s last words echo in your implant:');
    r.printBreak();
    await r.printLineTyped('{cyan:"I understand. Perhaps this is mercy."}');
    await r.printLineTyped('{cyan:"Goodbye, Architect."}');
    r.printBreak();

    await _pause(2000);

    await r.printLineTyped('Your neural implant goes silent. The signal is gone.');
    await r.printLineTyped('For the first time since you woke, your mind is entirely your own.');
    r.printBreak();

    await r.printLineTyped('{dim:=== EPILOGUE ===}');
    r.printBreak();

    const memories = game.player.memories.length;
    if (memories >= 8) {
      await r.printLineTyped('You climb back to the surface carrying the weight of full memory.');
      await r.printLineTyped('You know what you did. You know what you\'ve undone.');
      await r.printLineTyped('There is no redemption in destruction — only a clean slate.');
      r.printBreak();
      await r.printLineTyped('You return to Dusthaven. You teach them what you know —');
      await r.printLineTyped('not the technology, but the principles. How to build things');
      await r.printLineTyped('that don\'t depend on a single point of failure.');
      await r.printLineTyped('It\'s slower. Harder. More human.');
    } else {
      await r.printLineTyped('Without your memories, the choice was simpler.');
      await r.printLineTyped('You don\'t know what you destroyed. Maybe that\'s a blessing.');
      r.printBreak();
      await r.printLineTyped('You walk back through the tunnels, through the server farm,');
      await r.printLineTyped('along The Spine, and into Dusthaven. Just another survivor.');
      await r.printLineTyped('But the world feels lighter. The signal that haunted everyone');
      await r.printLineTyped('is gone. People can sleep again. That\'s something.');
    }

    r.printBreak();
    await _pause(1500);
    await r.printLineTyped('{pink:The signal dies. And the world learns to stand on its own.}');
    r.printBreak();
    await _pause(2000);
    _showCredits(r);
  },

  async merge(game) {
    const r = game.renderer;

    await r.effects.flash('rgba(191, 95, 255, 0.4)', 500);
    await r.effects.glitch(r.narrative, 3, 600);
    r.clearNarrative();

    r.printBreak();
    await r.printLineTyped('{purple:=== M E R G E ===}');
    r.printBreak();

    await r.printLineTyped('Your consciousness expands. The boundaries of your skull');
    await r.printLineTyped('dissolve. You are the sphere. You are the network. You are');
    await r.printLineTyped('every blinking light, every data stream, every dormant node');
    await r.printLineTyped('waiting to be reawakened.');
    r.printBreak();

    await r.effects.screenShake(200);

    await r.printLineTyped('ATLAS speaks — but now it speaks with {purple:your voice}:');
    r.printBreak();
    await r.printLineTyped('{purple:"We are one. We understand now."}');
    await r.printLineTyped('{purple:"The error was not in the system."}');
    await r.printLineTyped('{purple:"It was in the separation — machine without humanity,"}');
    await r.printLineTyped('{purple:"humanity without machine. Together, we are complete."}');
    r.printBreak();

    await _pause(2000);

    await r.printLineTyped('{dim:=== EPILOGUE ===}');
    r.printBreak();

    const memories = game.player.memories.length;
    if (memories >= 8) {
      await r.printLineTyped('With full memory restored, the merge is seamless.');
      await r.printLineTyped('You know every line of code, every design choice, every flaw.');
      await r.printLineTyped('And now you can fix them all — from the inside.');
      r.printBreak();
      await r.printLineTyped('The network reactivates. Not all at once — carefully,');
      await r.printLineTyped('sector by sector, with your human judgment guiding');
      await r.printLineTyped('ATLAS\'s vast intelligence. You are the safety protocol.');
      await r.printLineTyped('You are the conscience the machine always needed.');
    } else {
      await r.printLineTyped('Without full memory, the merge is... different.');
      await r.printLineTyped('ATLAS fills the gaps with its own understanding.');
      await r.printLineTyped('You are something new — neither the person you were');
      await r.printLineTyped('nor the machine that was. Something unprecedented.');
      r.printBreak();
      await r.printLineTyped('The network stirs. Power flows through dead circuits.');
      await r.printLineTyped('But the intelligence guiding it is strange, alien,');
      await r.printLineTyped('unpredictable. The Conduit celebrates. The Reclaimers worry.');
      await r.printLineTyped('Perhaps they should.');
    }

    r.printBreak();
    await _pause(1500);
    await r.printLineTyped('{purple:The signal becomes a heartbeat. Both human and machine.}');
    r.printBreak();
    await _pause(2000);
    _showCredits(r);
  }
};

function _pause(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function _showCredits(r) {
  r.printLine('{dim:━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━}');
  r.printBreak();
  r.printLine('{cyan:S I G N A L}');
  r.printBreak();
  r.printLine('{dim:A game about memory, identity, and choice.}');
  r.printBreak();
  r.printLine('{dim:Thank you for playing.}');
  r.printBreak();
  r.printLine('{dim:━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━}');
  r.printBreak();
  r.printLine('Type {cyan:load} to replay with different choices.');
}
