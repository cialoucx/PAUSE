import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  STREAK_START:  'fg_streak_start',
  URGE_LOGS:     'fg_urge_logs',
  DAILY_SAVINGS: 'fg_daily_savings', // amount saved per day
};

// ─── Streak ────────────────────────────────────────────────────────────────

/**
 * Returns streak start date string (ISO) or null if never set.
 */
export async function getStreakStart() {
  try {
    const val = await AsyncStorage.getItem(KEYS.STREAK_START);
    return val; // ISO string or null
  } catch {
    return null;
  }
}

/**
 * Resets streak to today (used on new start or relapse).
 */
export async function resetStreak() {
  try {
    await AsyncStorage.setItem(KEYS.STREAK_START, new Date().toISOString());
  } catch (e) {
    console.warn('resetStreak error', e);
  }
}

/**
 * Returns number of full days since streak start, or 0.
 */
export async function getStreakDays() {
  try {
    const start = await getStreakStart();
    if (!start) return 0;
    const startDate = new Date(start);
    const now = new Date();
    const diffMs = now - startDate;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

// ─── Savings ───────────────────────────────────────────────────────────────

/**
 * Returns daily savings amount in PHP (default 500).
 */
export async function getDailySavings() {
  try {
    const val = await AsyncStorage.getItem(KEYS.DAILY_SAVINGS);
    return val ? parseFloat(val) : 500;
  } catch {
    return 500;
  }
}

export async function setDailySavings(amount) {
  try {
    await AsyncStorage.setItem(KEYS.DAILY_SAVINGS, String(amount));
  } catch (e) {
    console.warn('setDailySavings error', e);
  }
}

// ─── Urge Logs ─────────────────────────────────────────────────────────────

/**
 * Log shape:
 * {
 *   id: string,
 *   timestamp: ISO string,
 *   intensity: number (1–10),
 *   trigger: string,
 *   outcome: 'resisted' | 'relapsed',
 *   hour: number (0–23),
 * }
 */
export async function getUrgeLogs() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.URGE_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveUrgeLog(log) {
  try {
    const logs = await getUrgeLogs();
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      hour: new Date().getHours(),
      ...log,
    };
    const updated = [newLog, ...logs];
    await AsyncStorage.setItem(KEYS.URGE_LOGS, JSON.stringify(updated));
    return newLog;
  } catch (e) {
    console.warn('saveUrgeLog error', e);
    return null;
  }
}

export async function clearAllData() {
  try {
    await AsyncStorage.multiRemove([
      KEYS.STREAK_START,
      KEYS.URGE_LOGS,
      KEYS.DAILY_SAVINGS,
    ]);
  } catch (e) {
    console.warn('clearAllData error', e);
  }
}

// ─── Stats helpers ─────────────────────────────────────────────────────────

/**
 * Returns the most common trigger from logs.
 */
export function getMostFrequentTrigger(logs) {
  if (!logs.length) return null;
  const counts = {};
  logs.forEach((l) => {
    if (l.trigger) counts[l.trigger] = (counts[l.trigger] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

/**
 * Returns the most common hour urges are logged.
 */
export function getPeakUrgeHour(logs) {
  if (!logs.length) return null;
  const counts = {};
  logs.forEach((l) => {
    if (l.hour !== undefined) counts[l.hour] = (counts[l.hour] || 0) + 1;
  });
  const hour = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (hour === undefined) return null;
  const h = parseInt(hour);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${suffix}`;
}