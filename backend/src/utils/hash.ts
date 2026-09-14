import crypto from 'node:crypto';

/**
 * Compute a deterministic SHA-256 hash of content for delta sync.
 * Uses a recursive key-sorting replacer so the hash is stable
 * regardless of object property insertion order.
 */
export function computeContentHash(data: unknown): string {
  const serialized = JSON.stringify(data, (_key, value) => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value as Record<string, unknown>)
        .sort()
        .reduce((sorted: Record<string, unknown>, key) => {
          sorted[key] = (value as Record<string, unknown>)[key];
          return sorted;
        }, {});
    }
    return value as unknown;
  });
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Hash a refresh token (or any secret) for secure database storage.
 * Uses SHA-256 — the raw token is never persisted.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
