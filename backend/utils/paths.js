import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));

export const DATA_DIR = path.join(here, '..', 'data');

export function dataPath(name) {
  return path.join(DATA_DIR, name);
}

export function ensureDataDir() {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}