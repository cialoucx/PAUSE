export function getMostFrequentTrigger(logs) {
  if (!logs.length) {
    return null;
  }

  const counts = logs.reduce((accumulator, log) => {
    if (log.trigger) {
      accumulator[log.trigger] = (accumulator[log.trigger] || 0) + 1;
    }
    return accumulator;
  }, {});

  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}

export function getPeakUrgeHour(logs) {
  if (!logs.length) {
    return null;
  }

  const counts = logs.reduce((accumulator, log) => {
    if (typeof log.hour === 'number') {
      accumulator[log.hour] = (accumulator[log.hour] || 0) + 1;
    }
    return accumulator;
  }, {});

  const rawHour = Object.entries(counts).sort(
    (left, right) => right[1] - left[1]
  )[0]?.[0];

  if (rawHour === undefined) {
    return null;
  }

  const hour = Number(rawHour);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${suffix}`;
}

function buildTrendData(logs, days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bucketMap = new Map();

  logs.forEach((log) => {
    const date = new Date(log.timestamp);
    date.setHours(0, 0, 0, 0);
    const key = date.toISOString();
    bucketMap.set(key, (bucketMap.get(key) || 0) + 1);
  });

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - index - 1));
    const key = date.toISOString();

    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: bucketMap.get(key) || 0,
    };
  });
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildStatsSnapshot({ dailySavings, logs, streakDays }) {
  const resisted = logs.filter((log) => log.outcome === 'resisted').length;
  const relapsed = logs.filter((log) => log.outcome === 'relapsed').length;
  const totalUrges = logs.length;
  const resistanceRate =
    totalUrges > 0 ? Math.round((resisted / totalUrges) * 100) : 0;

  return {
    streakDays,
    totalUrges,
    resisted,
    relapsed,
    resistanceRate,
    moneySaved: streakDays * dailySavings,
    topTrigger: getMostFrequentTrigger(logs),
    peakHour: getPeakUrgeHour(logs),
    trend: buildTrendData(logs),
  };
}
