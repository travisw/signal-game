/**
 * SIGNAL — Terminal Renderer
 *
 * Manages the three-zone layout: title bar, main area (narrative + sidebar),
 * and input bar. Provides methods for displaying text, ASCII art, HUD updates,
 * choices, and the fog-of-war map.
 */

import { Effects } from './effects.js';

export class Renderer {
  constructor() {
    // DOM references
    this.narrative = document.getElementById('narrative');
    this.sidebar = document.getElementById('sidebar');
    this.locationDisplay = document.getElementById('location-display');
    this.timeDisplay = document.getElementById('time-display');
    this.commandInput = document.getElementById('command-input');
    this.gameContainer = document.getElementById('game-container');

    // Effects engine
    this.effects = new Effects(this.gameContainer);

    // Track state for HUD
    this.hudState = null;

    // True while a multi-line typing sequence is in progress
    this._isAnimating = false;
  }

  // =====================
  // Narrative Panel
  // =====================

  /**
   * Print a line of text to the narrative panel.
   * Supports color spans via a simple markup:
   *   {pink:text}, {cyan:text}, {green:text}, {purple:text}, {amber:text}, {dim:text}, {bright:text}
   */
  printLine(text, cssClass = '') {
    const div = document.createElement('div');
    div.className = `narrative-line ${cssClass}`.trim();
    div.innerHTML = this._parseColorMarkup(text);
    this.narrative.appendChild(div);
    this._scrollToBottom();
    return div;
  }

  /**
   * Print a line with typing animation.
   */
  async printLineTyped(text, cssClass = '', speed) {
    const div = document.createElement('div');
    div.className = `narrative-line ${cssClass}`.trim();
    this.narrative.appendChild(div);
    await this.effects.typeHTML(div, this._parseColorMarkup(text), speed);
    this._scrollToBottom();
    return div;
  }

  /**
   * Print a blank line / spacer.
   */
  printBreak() {
    const div = document.createElement('div');
    div.className = 'narrative-break';
    this.narrative.appendChild(div);
    this._scrollToBottom();
  }

  /**
   * Display ASCII art in the narrative panel.
   */
  printAsciiArt(artText, cssClass = '') {
    const pre = document.createElement('pre');
    pre.className = `ascii-art ${cssClass}`.trim();
    pre.innerHTML = this._alignAsciiArt(artText);
    this.narrative.appendChild(pre);
    this._scrollToBottom();
    return pre;
  }

  /**
   * Display a set of numbered choices.
   * choices: Array of { text, disabled?, skillCheck? }
   * Returns nothing — input handler deals with selection.
   */
  showChoices(choices) {
    const container = document.createElement('div');
    container.className = 'choices';

    choices.forEach((choice, i) => {
      const div = document.createElement('div');
      div.className = 'choice-line';

      let label = `<span class="choice-number">[${i + 1}]</span> ${this._parseColorMarkup(choice.text)}`;

      if (choice.skillCheck) {
        const color = choice.skillCheck.met ? 't-green' : 't-red';
        label += ` <span class="${color}">(${choice.skillCheck.skill}: ${choice.skillCheck.level})</span>`;
      }

      if (choice.disabled) {
        div.style.opacity = '0.4';
        div.style.pointerEvents = 'none';
      }

      div.innerHTML = label;

      // Make choices tappable (mobile) — clicking submits the number.
      // Uses the stored callback directly instead of dispatching a
      // synthetic KeyboardEvent (which is unreliable on mobile browsers).
      if (!choice.disabled) {
        const choiceNum = i + 1;
        div.addEventListener('click', () => {
          if (this._onCommandCallback) {
            this.commandInput.value = '';
            this._onCommandCallback(String(choiceNum));
          }
        });
      }
      container.appendChild(div);
    });

    this.narrative.appendChild(container);
    this._scrollToBottom();
    return container;
  }

  /**
   * Display a notification/system message.
   */
  printNotification(text, type = 'info') {
    const div = document.createElement('div');
    const colorClass = {
      info: 't-cyan',
      warning: 't-amber',
      danger: 't-pink',
      success: 't-green',
    }[type] || 't-cyan';

    div.className = `notification`;
    div.style.borderLeftColor = `var(--${type === 'danger' ? 'pink' : type === 'warning' ? 'amber' : type === 'success' ? 'green' : 'cyan'})`;
    div.innerHTML = `<span class="${colorClass}">${this._parseColorMarkup(text)}</span>`;
    this.narrative.appendChild(div);
    this._scrollToBottom();
    return div;
  }

  /**
   * Clear the narrative panel.
   */
  clearNarrative() {
    this.narrative.innerHTML = '';
  }

  /**
   * Display enemy combat info.
   */
  showEnemy(enemy) {
    const container = document.createElement('div');
    container.className = 'enemy-display';

    // ASCII art
    if (enemy.art) {
      const pre = document.createElement('pre');
      pre.className = 'ascii-art';
      pre.style.color = 'var(--red)';
      pre.innerHTML = this._parseColorMarkup(enemy.art);
      container.appendChild(pre);
    }

    // Name and HP
    const hpPercent = Math.round((enemy.hp / enemy.maxHp) * 100);
    const hpBars = Math.round((enemy.hp / enemy.maxHp) * 8);
    const hpFull = '█'.repeat(hpBars);
    const hpEmpty = '░'.repeat(8 - hpBars);

    const info = document.createElement('div');
    info.innerHTML = `
      <span class="enemy-name">${enemy.name}</span>
      <span class="t-dim"> — ${enemy.type}</span><br>
      <span class="enemy-hp-bar">HP <span class="t-red">${hpFull}</span><span class="bar-empty">${hpEmpty}</span> ${hpPercent}%</span>
      ${enemy.weakness ? `<br><span class="t-dim">Weakness: </span><span class="t-amber">${enemy.weakness}</span>` : ''}
    `;
    container.appendChild(info);

    this.narrative.appendChild(container);
    this._scrollToBottom();
    return container;
  }

  // =====================
  // Title Bar
  // =====================

  /**
   * Update the location display in the title bar.
   */
  setLocation(sectorName, areaName) {
    let text = sectorName.toUpperCase();
    if (areaName) {
      text += ` — ${areaName.toUpperCase()}`;
    }
    this.locationDisplay.textContent = text;
  }

  /**
   * Update the time display.
   */
  setTime(day, hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    const m = String(minute).padStart(2, '0');
    this.timeDisplay.textContent = `DAY ${day} • ${h}:${m} ${period}`;
  }

  // =====================
  // Sidebar / HUD
  // =====================

  /**
   * Full HUD update. Expects a state object:
   * {
   *   name, level,
   *   hp, maxHp,
   *   nrg, maxNrg,
   *   rad, maxRad,
   *   skills: { hack, bio, combat },
   *   inventory: [ { name, icon, qty } ],
   *   mapData: { grid, playerPos, legend }
   * }
   */
  updateHUD(state) {
    this.hudState = state;
    let html = '';

    const nameStr = state.name || '???';
    const lvlStr = `Lv.${state.level || 1}`;

    // Status panel
    html += this._panel('top', 'STATUS');
    html += this._padRow(` <span class="t-bright">${nameStr}</span> <span class="t-dim">${lvlStr}</span>`, 1 + nameStr.length + 1 + lvlStr.length);
    html += this._emptyRow();
    html += this._statBar('HP', state.hp, state.maxHp, 'bar-hp');
    html += this._statBar('NRG', state.nrg, state.maxNrg, 'bar-nrg');
    html += this._statBar('RAD', state.rad, state.maxRad, 'bar-rad');
    html += this._emptyRow();

    // Skills panel
    html += this._panel('mid', 'SKILLS');
    const skills = state.skills || {};
    html += this._skillBar('HACK', skills.hack || 0, 5, 't-cyan');
    html += this._skillBar('BIO', skills.bio || 0, 5, 't-green');
    html += this._skillBar('FIGHT', skills.combat || 0, 5, 't-pink');
    html += this._emptyRow();

    // Inventory panel
    html += this._panel('mid', 'INVENTORY');
    const inv = state.inventory || [];
    if (inv.length === 0) {
      html += this._padRow(' <span class="t-dim">(empty)</span>', 8);
    } else {
      for (const item of inv.slice(0, 6)) {
        const qty = item.qty > 1 ? `x${item.qty}` : '';
        const name = item.name.length > 14 ? item.name.slice(0, 13) + '~' : item.name;
        const visLen = 1 + name.length + (qty ? 1 + qty.length : 0);
        html += this._padRow(` <span class="t-amber">${name}</span>${qty ? ' <span class="t-dim">' + qty + '</span>' : ''}`, visLen);
      }
      if (inv.length > 6) {
        const moreStr = ` +${inv.length - 6} more...`;
        html += this._padRow(`<span class="t-dim">${moreStr}</span>`, moreStr.length);
      }
    }
    html += this._emptyRow();

    // Map panel
    if (state.mapData) {
      html += this._panel('mid', 'MAP');
      html += this._renderMap(state.mapData);
    }

    html += this._panelEnd();

    this.sidebar.innerHTML = html;

    // Update RAD visual effects
    this.effects.updateRadShift(
      state.maxRad > 0 ? (state.rad / state.maxRad) * 100 : 0
    );
  }

  // =====================
  // Input
  // =====================

  /**
   * Focus the command input.
   */
  focusInput() {
    this.commandInput.focus();
  }

  /**
   * Clear the command input.
   */
  clearInput() {
    this.commandInput.value = '';
  }

  /**
   * Disable/enable the command input.
   */
  setInputEnabled(enabled) {
    this.commandInput.disabled = !enabled;
    if (enabled) {
      this.focusInput();
    }
  }

  /**
   * Register a handler for command submission (Enter key).
   */
  onCommand(callback) {
    // Store callback for use by tappable choices
    this._onCommandCallback = callback;

    // Command history (up/down arrow)
    this._history = [];
    this._historyIndex = -1;

    this.commandInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = this.commandInput.value.trim();
        if (value) {
          // Add to history (avoid consecutive duplicates)
          if (this._history.length === 0 || this._history[this._history.length - 1] !== value) {
            this._history.push(value);
          }
          this._historyIndex = -1;
          this.clearInput();
          callback(value);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this._history.length === 0) return;
        if (this._historyIndex === -1) {
          this._historyIndex = this._history.length - 1;
        } else if (this._historyIndex > 0) {
          this._historyIndex--;
        }
        this.commandInput.value = this._history[this._historyIndex];
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this._historyIndex === -1) return;
        if (this._historyIndex < this._history.length - 1) {
          this._historyIndex++;
          this.commandInput.value = this._history[this._historyIndex];
        } else {
          this._historyIndex = -1;
          this.commandInput.value = '';
        }
      }
    });

    // Skip typing animation with Space bar only — no ambiguity.
    document.addEventListener('keydown', (e) => {
      if (e.key !== ' ') return;
      if (!this._isAnimating && !this.effects.isTyping) return;
      e.preventDefault(); // Don't type a space into the input
      this.effects.skip();
    });

    // Mobile keyboard handling: keep input visible when keyboard opens.
    // The visualViewport API gives us the actual visible area.
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        // Set the game container height to the visual viewport height.
        // This shrinks the game when the keyboard is open instead of
        // pushing the top bar off screen.
        this.gameContainer.style.height = `${window.visualViewport.height}px`;
      });
    }

    // Scroll input into view when focused on mobile
    this.commandInput.addEventListener('focus', () => {
      setTimeout(() => {
        this.commandInput.scrollIntoView({ block: 'nearest' });
      }, 300); // Delay to let keyboard finish animating
    });

    // Click anywhere to focus input (when not typing)
    this.gameContainer.addEventListener('click', (e) => {
      if (e.target !== this.commandInput && !window.getSelection().toString()) {
        this.focusInput();
      }
    });
  }

  // =====================
  // Internal Helpers
  // =====================

  _scrollToBottom() {
    this.narrative.scrollTop = this.narrative.scrollHeight;
  }

  /**
   * Parse simple color markup: {color:text}
   */
  _parseColorMarkup(text) {
    if (!text) return '';
    return text.replace(/\{(\w+):([^}]*)\}/g, (_, color, content) => {
      const validColors = ['pink', 'cyan', 'green', 'purple', 'amber', 'red', 'dim', 'bright'];
      if (validColors.includes(color)) {
        return `<span class="t-${color}">${content}</span>`;
      }
      return content;
    });
  }

  /**
   * Strip color markup to get visible text only (for measuring).
   */
  _stripMarkup(text) {
    return text.replace(/\{(\w+):([^}]*)}/g, (_, _color, content) => content);
  }

  /**
   * Align ASCII art: pad all lines to equal visible width, then apply color markup.
   */
  _alignAsciiArt(artText) {
    const lines = artText.split('\n');

    // Find the max visible width
    let maxWidth = 0;
    for (const line of lines) {
      const visLen = this._stripMarkup(line).length;
      if (visLen > maxWidth) maxWidth = visLen;
    }

    // Pad each line to max visible width, then apply markup
    const aligned = lines.map(line => {
      const visLen = this._stripMarkup(line).length;
      const padded = line + ' '.repeat(Math.max(0, maxWidth - visLen));
      return this._parseColorMarkup(padded);
    });

    return aligned.join('\n');
  }

  // --- Panel construction helpers ---

  get _panelWidth() { return 22; }

  _panel(type, title) {
    const w = this._panelWidth;
    const left = type === 'top' ? '┌' : '├';
    const right = type === 'top' ? '┐' : '┤';
    const titleStr = ` ${title} `;
    const pad = w - 2 - 1 - titleStr.length; // -2 for corners, -1 for leading ─
    return `<span class="panel-border">${left}─</span><span class="panel-header">${titleStr}</span><span class="panel-border">${'─'.repeat(Math.max(0, pad))}${right}</span>\n`;
  }

  _panelEnd() {
    const w = this._panelWidth;
    return `<span class="panel-border">└${'─'.repeat(w - 2)}┘</span>\n`;
  }

  _row(content) {
    return `<span class="panel-border">│</span>${content}<span class="panel-border">│</span>\n`;
  }

  /**
   * Pad content to fill the panel interior.
   * textLen = number of visible characters (excluding HTML tags).
   */
  _padRow(content, textLen) {
    const interior = this._panelWidth - 2; // minus │ on each side
    const pad = interior - textLen;
    return this._row(content + ' '.repeat(Math.max(0, pad)));
  }

  _emptyRow() {
    const interior = this._panelWidth - 2;
    return this._row(' '.repeat(interior));
  }

  _statBar(label, current, max, cssClass) {
    const pct = max > 0 ? current / max : 0;
    const bars = 6;
    const filled = Math.round(pct * bars);
    const empty = bars - filled;
    const percent = Math.round(pct * 100);
    const padLabel = label.padEnd(3);
    const pctStr = String(percent).padStart(3) + '%';
    // visible: " HP  ██████░░ 74%" = 1 + 3 + 1 + 6 + 1 + 4 = 16
    const content = ` <span class="${cssClass}">${padLabel}</span> <span class="${cssClass}">${'█'.repeat(filled)}</span><span class="bar-empty">${'░'.repeat(empty)}</span> <span class="${cssClass}">${pctStr}</span>`;
    const visLen = 1 + 3 + 1 + 6 + 1 + 4; // 16
    return this._padRow(content, visLen);
  }

  _skillBar(label, level, max, cssClass) {
    const filled = Math.min(level, max);
    const empty = max - filled;
    const padLabel = label.padEnd(5);
    const lvlStr = String(level);
    // visible: " HACK  ███░░ 3" = 1 + 5 + 1 + 5 + 1 + len(lvlStr)
    const content = ` <span class="${cssClass}">${padLabel}</span> <span class="${cssClass}">${'█'.repeat(filled)}</span><span class="bar-empty">${'░'.repeat(empty)}</span> <span class="t-dim">${lvlStr}</span>`;
    const visLen = 1 + 5 + 1 + 5 + 1 + lvlStr.length;
    return this._padRow(content, visLen);
  }

  _renderMap(mapData) {
    let html = '';
    const { grid, legend } = mapData;

    for (let y = 0; y < grid.length; y++) {
      let row = ' ';
      for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];
        row += this._mapCell(cell) + ' ';
      }
      // Each row: 1 leading space + cols*2 chars
      const visLen = 1 + grid[y].length * 2;
      html += this._padRow(row, visLen);
    }

    if (legend) {
      // Truncate legend to fit panel interior
      const interior = this._panelWidth - 2;
      let parts = [];
      for (const [symbol, label] of Object.entries(legend)) {
        parts.push(`${symbol}=${label}`);
      }
      let legendStr = parts.join(' ');
      if (legendStr.length + 1 > interior) {
        // Abbreviate to fit
        legendStr = legendStr.slice(0, interior - 1);
      }
      html += this._padRow(` <span class="t-dim">${legendStr}</span>`, 1 + legendStr.length);
    }

    return html;
  }

  _mapCell(cell) {
    switch (cell) {
      case 'visited': return '<span class="t-cyan">#</span>';
      case 'current': return '<span class="t-bright" style="text-shadow:0 0 4px var(--pink-glow);">@</span>';
      case 'safe': return '<span class="t-green">■</span>';
      case 'danger': return '<span class="t-red">!</span>';
      case 'unknown': return '<span class="t-pink">?</span>';
      case 'path': return '<span class="t-cyan">─</span>';
      case 'path-v': return '<span class="t-cyan">│</span>';
      case 'unexplored': return '<span class="t-dim">·</span>';
      case 'exit': return '<span class="t-amber">□</span>';
      default: return '<span class="t-dim">·</span>';
    }
  }
}
