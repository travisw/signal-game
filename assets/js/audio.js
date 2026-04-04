/**
 * SIGNAL — Audio Engine
 *
 * Procedural terminal sounds using the Web Audio API.
 * No audio files — everything is synthesized.
 *
 * Design principle: sounds should feel like they come from
 * the terminal itself — electronic, lo-fi, restrained.
 */

export class AudioEngine {
  constructor() {
    this.ctx = null; // Lazy-init on first user interaction
    this.enabled = true;
    this.volume = 0.3;
    this._initialized = false;
  }

  /**
   * Initialize audio context on first user interaction.
   * Browsers require a user gesture before playing audio.
   */
  init() {
    if (this._initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._initialized = true;
    } catch {
      this.enabled = false;
    }
  }

  /**
   * Short blip — for each character typed during typing animation.
   * Very subtle, high-pitched, barely audible.
   */
  blip() {
    if (!this._ready()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 800 + Math.random() * 400; // 800-1200 Hz
    gain.gain.value = this.volume * 0.04; // Very quiet

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * Key click — when the player submits a command.
   * Mechanical keyboard feel.
   */
  keyClick() {
    if (!this._ready()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.value = 400;
    gain.gain.value = this.volume * 0.08;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Confirmation chirp — for successful actions (item pickup, hack success).
   * Rising two-tone beep.
   */
  confirm() {
    if (!this._ready()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    gain.gain.value = this.volume * 0.1;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(900, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Error buzz — for failed actions, damage taken.
   * Low, harsh, brief.
   */
  error() {
    if (!this._ready()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 120;
    gain.gain.value = this.volume * 0.08;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * Room transition — sweep sound when entering a new room.
   * Descending tone, like a CRT powering on.
   */
  transition() {
    if (!this._ready()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    gain.gain.value = this.volume * 0.06;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Memory reveal — eerie ascending tone for memory fragments.
   * Slow, haunting, reverb-like.
   */
  memoryReveal() {
    if (!this._ready()) return;

    // Three staggered tones for a chord-like effect
    [0, 0.1, 0.2].forEach((delay, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = [400, 600, 800][i];
      gain.gain.value = this.volume * 0.07;

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime + delay;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    });
  }

  /**
   * Combat alert — sharp staccato for hostile encounter.
   * Three quick descending pings.
   */
  combatAlert() {
    if (!this._ready()) return;

    [0, 0.08, 0.16].forEach((delay, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.value = 1000 - i * 200;
      gain.gain.value = this.volume * 0.1;

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime + delay;
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    });
  }

  /**
   * Hack sequence — rapid-fire digital noise for hacking.
   * Series of random-pitch blips.
   */
  hackSequence() {
    if (!this._ready()) return;

    for (let i = 0; i < 8; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.value = 300 + Math.random() * 2000;
      gain.gain.value = this.volume * 0.05;

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime + i * 0.04;
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  }

  /**
   * Boot beep — for the boot sequence startup.
   * Classic POST beep.
   */
  bootBeep() {
    if (!this._ready()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 1000;
    gain.gain.value = this.volume * 0.12;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(this.volume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Death — low ominous drone for game over.
   */
  death() {
    if (!this._ready()) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 80;
    gain.gain.value = this.volume * 0.1;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.frequency.exponentialRampToValueAtTime(40, now + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc.start(now);
    osc.stop(now + 1.5);
  }

  /**
   * Signal pulse — subtle recurring pulse for the signal motif.
   * Used sparingly in key story moments.
   */
  signalPulse() {
    if (!this._ready()) return;

    [0, 0.3].forEach((delay) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = 440;
      gain.gain.value = this.volume * 0.06;

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime + delay;
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  // --- Internal ---

  _ready() {
    if (!this.enabled || !this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }
}
