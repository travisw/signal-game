/**
 * SIGNAL — Terminal Effects Engine
 *
 * Typing animation, glitch, screen shake, boot sequence,
 * RAD color shift, and transition effects.
 */

export class Effects {
  constructor(container) {
    this.container = container;
    this.typingSpeed = 20; // ms per character
    this.skipRequested = false;
    this.skipAllRequested = false;
    this.isTyping = false;
  }

  /**
   * Type text character by character into a target element.
   * Returns a promise that resolves when done or skipped.
   */
  async typeText(targetEl, text, speed = this.typingSpeed) {
    this.isTyping = true;
    this.skipRequested = false;

    if (this.skipAllRequested) {
      targetEl.textContent = text;
      this.isTyping = false;
      return;
    }

    for (let i = 0; i < text.length; i++) {
      if (this.skipRequested || this.skipAllRequested) {
        targetEl.textContent = text;
        break;
      }
      targetEl.textContent += text[i];
      await this._wait(speed);
    }

    this.isTyping = false;
  }

  /**
   * Type HTML content into a target element, character by character.
   * Handles tags as atomic units (inserts whole tag at once).
   */
  async typeHTML(targetEl, html, speed = this.typingSpeed) {
    this.isTyping = true;
    this.skipRequested = false;

    if (this.skipAllRequested) {
      targetEl.innerHTML = html;
      this.isTyping = false;
      return;
    }

    // Parse into segments: text characters and HTML tags
    const segments = [];
    let i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        if (end !== -1) {
          segments.push({ type: 'tag', value: html.slice(i, end + 1) });
          i = end + 1;
        } else {
          segments.push({ type: 'char', value: html[i] });
          i++;
        }
      } else if (html[i] === '&') {
        const end = html.indexOf(';', i);
        if (end !== -1 && end - i < 10) {
          segments.push({ type: 'entity', value: html.slice(i, end + 1) });
          i = end + 1;
        } else {
          segments.push({ type: 'char', value: html[i] });
          i++;
        }
      } else {
        segments.push({ type: 'char', value: html[i] });
        i++;
      }
    }

    let built = '';
    for (const seg of segments) {
      if (this.skipRequested || this.skipAllRequested) {
        targetEl.innerHTML = html;
        break;
      }
      built += seg.value;
      // For tags, insert without delay
      if (seg.type === 'tag') {
        targetEl.innerHTML = built;
        continue;
      }
      targetEl.innerHTML = built;
      // Only delay on visible characters
      if (seg.type === 'char' && seg.value !== ' ') {
        await this._wait(speed);
      } else {
        await this._wait(speed / 3);
      }
    }

    this.isTyping = false;
  }

  /**
   * Skip all current and pending typing animations.
   */
  skip() {
    this.skipRequested = true;
    this.skipAllRequested = true;
  }

  /**
   * Reset skip state. Call when starting a new command/action
   * so typing resumes normally.
   */
  resetSkip() {
    this.skipRequested = false;
    this.skipAllRequested = false;
  }

  /**
   * Play the boot sequence animation.
   */
  async bootSequence(targetEl) {
    const lines = [
      { text: 'BIOS POST... OK', delay: 200 },
      { text: 'MEMORY CHECK... 2048MB DETECTED', delay: 150 },
      { text: 'NEURAL INTERFACE... CONNECTED', delay: 300 },
      { text: 'NETWORK SCAN... NO ACTIVE NODES', delay: 400 },
      { text: 'SIGNAL DETECTED... SOURCE UNKNOWN', delay: 500 },
      { text: '', delay: 200 },
      { text: 'LOADING SYSTEM...', delay: 600 },
      { text: '', delay: 300 },
    ];

    for (const line of lines) {
      if (this.skipRequested || this.skipAllRequested) {
        targetEl.innerHTML = '';
        return;
      }

      if (line.text === '') {
        targetEl.innerHTML += '<br>';
      } else {
        const lineEl = document.createElement('div');
        lineEl.className = 'boot-text';
        targetEl.appendChild(lineEl);
        await this.typeText(lineEl, `> ${line.text}`, 15);
      }
      await this._wait(line.delay);
    }

    // Final dramatic pause then clear
    await this._wait(500);
  }

  /**
   * Glitch effect — briefly corrupts text in target element.
   */
  async glitch(targetEl, intensity = 1, duration = 300) {
    const original = targetEl.innerHTML;
    const glitchChars = '█▓▒░╔╗╚╝║═╬╠╣╩╦┼─│┌┐└┘├┤┬┴';
    const iterations = Math.floor(duration / 50);

    for (let i = 0; i < iterations; i++) {
      const text = targetEl.textContent;
      let corrupted = '';
      for (const ch of text) {
        if (Math.random() < 0.1 * intensity && ch !== '\n' && ch !== ' ') {
          corrupted += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          corrupted += ch;
        }
      }
      targetEl.textContent = corrupted;
      targetEl.classList.add('glitch');
      await this._wait(50);
    }

    targetEl.innerHTML = original;
    targetEl.classList.remove('glitch');
  }

  /**
   * Screen shake effect.
   */
  async screenShake(duration = 400) {
    this.container.classList.add('shake');
    await this._wait(duration);
    this.container.classList.remove('shake');
  }

  /**
   * Flash a color overlay briefly.
   */
  async flash(color = 'rgba(255, 45, 149, 0.15)', duration = 150) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: ${color}; pointer-events: none; z-index: 99;
      transition: opacity ${duration}ms ease-out;
    `;
    document.body.appendChild(overlay);

    await this._wait(50);
    overlay.style.opacity = '0';
    await this._wait(duration);
    overlay.remove();
  }

  /**
   * Apply or remove the RAD color shift based on radiation level.
   */
  updateRadShift(radPercent) {
    if (radPercent >= 75) {
      this.container.style.filter = 'hue-rotate(-30deg) saturate(1.3) brightness(0.95)';
    } else if (radPercent >= 50) {
      this.container.style.filter = 'hue-rotate(-15deg) saturate(1.15)';
    } else {
      this.container.style.filter = '';
    }
  }

  /**
   * Transition effect between areas — brief static burst.
   */
  async transitionStatic(duration = 400) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none; z-index: 99;
      background: repeating-linear-gradient(
        0deg,
        transparent 0px,
        rgba(0, 229, 255, 0.03) 1px,
        transparent 2px
      );
      animation: staticNoise ${duration}ms ease-out forwards;
    `;
    document.body.appendChild(overlay);

    await this._wait(duration);
    overlay.remove();
  }

  /**
   * Dramatic text reveal for memory fragments.
   */
  async memoryReveal(targetEl, text, speed = 30) {
    await this.flash('rgba(191, 95, 255, 0.2)', 200);
    await this.screenShake(200);

    const wrapper = document.createElement('div');
    wrapper.className = 'memory-fragment';
    targetEl.appendChild(wrapper);

    await this.typeText(wrapper, text, speed);
  }

  // --- Internal helpers ---

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
