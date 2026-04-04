/**
 * SIGNAL — Save System
 *
 * Storage-agnostic save/load. Detects WordPress environment
 * and uses WP REST API, otherwise falls back to localStorage.
 */

export class SaveManager {
  constructor() {
    // Detect WordPress environment
    this.useWP = typeof window !== 'undefined' && window.wpSignalGame;
    this.wpConfig = this.useWP ? window.wpSignalGame : null;
  }

  /**
   * Save game state to a named slot.
   */
  async save(slot, state) {
    const data = {
      ...state,
      savedAt: new Date().toISOString(),
      version: 1,
    };

    if (this.useWP) {
      return this._wpSave(slot, data);
    }
    return this._localSave(slot, data);
  }

  /**
   * Load game state from a named slot.
   * Returns null if no save exists.
   */
  async load(slot) {
    if (this.useWP) {
      return this._wpLoad(slot);
    }
    return this._localLoad(slot);
  }

  /**
   * List available save slots.
   * Returns array of { slot, savedAt }
   */
  async listSaves() {
    if (this.useWP) {
      return this._wpListSaves();
    }
    return this._localListSaves();
  }

  /**
   * Delete a save slot.
   */
  async deleteSave(slot) {
    if (this.useWP) {
      return this._wpDeleteSave(slot);
    }
    return this._localDeleteSave(slot);
  }

  // --- localStorage backend ---

  _localSave(slot, data) {
    try {
      localStorage.setItem(`signal_save_${slot}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }

  _localLoad(slot) {
    try {
      const raw = localStorage.getItem(`signal_save_${slot}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  }

  _localListSaves() {
    const saves = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('signal_save_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          saves.push({
            slot: key.replace('signal_save_', ''),
            savedAt: data.savedAt,
          });
        } catch (e) {
          // skip corrupted saves
        }
      }
    }
    return saves;
  }

  _localDeleteSave(slot) {
    localStorage.removeItem(`signal_save_${slot}`);
    return true;
  }

  // --- WordPress REST API backend ---

  async _wpSave(slot, data) {
    try {
      const response = await fetch(`${this.wpConfig.apiBase}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': this.wpConfig.nonce,
        },
        body: JSON.stringify({ slot, data }),
      });
      return response.ok;
    } catch (e) {
      console.error('WP save failed:', e);
      return false;
    }
  }

  async _wpLoad(slot) {
    try {
      const response = await fetch(
        `${this.wpConfig.apiBase}/load?slot=${encodeURIComponent(slot)}`,
        { headers: { 'X-WP-Nonce': this.wpConfig.nonce } }
      );
      if (!response.ok) return null;
      const result = await response.json();
      return result.data || null;
    } catch (e) {
      console.error('WP load failed:', e);
      return null;
    }
  }

  async _wpListSaves() {
    try {
      const response = await fetch(
        `${this.wpConfig.apiBase}/saves`,
        { headers: { 'X-WP-Nonce': this.wpConfig.nonce } }
      );
      if (!response.ok) return [];
      return response.json();
    } catch (e) {
      console.error('WP list saves failed:', e);
      return [];
    }
  }

  async _wpDeleteSave(slot) {
    try {
      const response = await fetch(
        `${this.wpConfig.apiBase}/save?slot=${encodeURIComponent(slot)}`,
        {
          method: 'DELETE',
          headers: { 'X-WP-Nonce': this.wpConfig.nonce },
        }
      );
      return response.ok;
    } catch (e) {
      console.error('WP delete save failed:', e);
      return false;
    }
  }
}
