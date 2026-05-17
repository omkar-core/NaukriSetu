const usageStore = {
  jsearch: { count: 0, month: null },
  serpapi: { count: 0, month: null },
};

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function checkAndTrackUsage(apiName) {
  const currentMonth = getCurrentMonth();
  const store = usageStore[apiName];
  if (!store) return true;

  if (store.month !== currentMonth) {
    store.month = currentMonth;
    store.count = 0;
  }

  const limits = { jsearch: 180, serpapi: 25 };
  const limit = limits[apiName];

  if (store.count >= limit) {
    return false;
  }

  store.count++;
  return true;
}

export function getUsageStats() {
  return { ...usageStore };
}
