import { createHash } from 'crypto';

// Compute a deterministic fingerprint for a job listing
// to prevent duplicates from multiple API sources
export function hashJob(title, organization) {
  const normalized = `${title.toLowerCase().trim()}|${organization.toLowerCase().trim()}`;
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}
