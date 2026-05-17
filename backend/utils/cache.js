// In-memory cache with TTL — used by all route handlers
// No database needed for dev. In production, swap setCache/getCache with Firestore reads.
const store = new Map();

export function setCache(key, data, ttlMs = 15 * 60 * 1000) {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
  return entry.data;
}

export function invalidateCache(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

export function getCacheStats() {
  return { size: store.size, keys: [...store.keys()] };
}
