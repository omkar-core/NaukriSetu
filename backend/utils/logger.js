// Safe logger — never logs API keys or sensitive env vars
const SENSITIVE_PATTERNS = [
  /sk-or-v1-[a-zA-Z0-9]+/g,
  /AIza[a-zA-Z0-9_-]+/g,
  /[0-9a-f]{32}/g,
];

function sanitize(msg) {
  if (typeof msg !== 'string') return msg;
  let safe = msg;
  for (const pattern of SENSITIVE_PATTERNS) {
    safe = safe.replace(pattern, '[REDACTED]');
  }
  return safe;
}

export const logger = {
  info: (...args) => console.log('[INFO]', ...args.map(sanitize)),
  warn: (...args) => console.warn('[WARN]', ...args.map(sanitize)),
  error: (...args) => console.error('[ERROR]', ...args.map(sanitize)),
  cron: (...args) => console.log('[CRON]', ...args.map(sanitize)),
};
