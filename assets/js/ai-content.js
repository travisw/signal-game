/**
 * SIGNAL — AI Content Service
 *
 * Client-side service that requests AI-generated content packets
 * from the WordPress AI gateway. Falls back silently to static
 * content when unavailable.
 *
 * Delivery strategy: static-first + pre-fetch neighbors.
 * The player never waits for AI content.
 */

export class AIContentService {
  constructor(config) {
    this.enabled = config?.enabled || false;
    this.endpoint = config?.endpoint || null;
    this.nonce = config?.nonce || null;
    this.cache = new Map();
    this._inflight = new Set();
  }

  /**
   * Blocking request — fetches and returns content.
   * Returns null if unavailable (silent fallback).
   */
  async request(packetType, context) {
    if (!this.enabled || !this.endpoint) return null;

    const cacheKey = this._fingerprint(packetType, context);
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    try {
      const resp = await fetch(`${this.endpoint}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': this.nonce,
        },
        body: JSON.stringify({ packetType, context }),
      });

      if (!resp.ok) return null;
      const data = await resp.json();
      if (data.fallback || !data.content) return null;

      this.cache.set(cacheKey, data.content);
      return data.content;
    } catch {
      return null;
    }
  }

  /**
   * Fire-and-forget background request — populates cache.
   * Does not block. Does not return content.
   */
  requestBackground(packetType, context) {
    if (!this.enabled || !this.endpoint) return;

    const cacheKey = this._fingerprint(packetType, context);
    if (this.cache.has(cacheKey)) return;
    if (this._inflight.has(cacheKey)) return;

    this._inflight.add(cacheKey);
    this.request(packetType, context)
      .then(content => {
        if (content) this.cache.set(cacheKey, content);
      })
      .finally(() => this._inflight.delete(cacheKey));
  }

  /**
   * Synchronous cache check — no network request.
   * Returns cached content or null.
   */
  getCached(packetType, sectorId, roomId) {
    for (const [key, val] of this.cache) {
      if (key.startsWith(`${packetType}:${sectorId}:${roomId}:`)) return val;
    }
    return null;
  }

  /**
   * Build a deterministic cache key from packet type + context.
   */
  _fingerprint(type, ctx) {
    const parts = [
      type,
      ctx.sectorId || '',
      ctx.roomId || '',
      `v${ctx.visitCount || 0}`,
      `d${ctx.day || 0}`,
    ];
    return parts.join(':');
  }
}
