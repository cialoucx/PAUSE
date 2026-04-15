import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  STREAK_START: 'fg_streak_start',
  URGE_LOGS: 'fg_urge_logs',
  DAILY_SAVINGS: 'fg_daily_savings',
};

const DEFAULT_DAILY_SAVINGS = 500;
const STORAGE_RETRY_DELAYS_MS = [0, 120, 300];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function retryStorageWrite(operationName, operation) {
  let lastError = null;

  for (const waitMs of STORAGE_RETRY_DELAYS_MS) {
    try {
      if (waitMs > 0) {
        await delay(waitMs);
      }

      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`${operationName} attempt failed`, error);
    }
  }

  throw new Error(
    `${operationName} failed after ${STORAGE_RETRY_DELAYS_MS.length} attempts: ${String(
      lastError?.message || lastError
    )}`
  );
}

export async function getStreakStart() {
  try {
    return await AsyncStorage.getItem(KEYS.STREAK_START);
  } catch (error) {
    console.warn('getStreakStart error', error);
    return null;
  }
}

export async function resetStreak() {
  return retryStorageWrite('resetStreak', async () => {
    await AsyncStorage.setItem(KEYS.STREAK_START, new Date().toISOString());
    return true;
  });
}

export async function getStreakDays() {
  try {
    const start = await getStreakStart();
    if (!start) {
      return 0;
    }

    const startDate = new Date(start);
    const now = new Date();
    const diffMs = now - startDate;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.warn('getStreakDays error', error);
    return 0;
  }
}

export async function getDailySavings() {
  try {
    const value = await AsyncStorage.getItem(KEYS.DAILY_SAVINGS);
    return value ? Number.parseFloat(value) : DEFAULT_DAILY_SAVINGS;
  } catch (error) {
    console.warn('getDailySavings error', error);
    return DEFAULT_DAILY_SAVINGS;
  }
}

export async function setDailySavings(amount) {
  return retryStorageWrite('setDailySavings', async () => {
    await AsyncStorage.setItem(KEYS.DAILY_SAVINGS, String(amount));
    return true;
  });
}

export async function getUrgeLogs() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.URGE_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('getUrgeLogs error', error);
    return [];
  }
}

export async function saveUrgeLog(log) {
  return retryStorageWrite('saveUrgeLog', async () => {
    const logs = await getUrgeLogs();
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      hour: new Date().getHours(),
      ...log,
    };
    const updatedLogs = [newLog, ...logs];
    await AsyncStorage.setItem(KEYS.URGE_LOGS, JSON.stringify(updatedLogs));
    return newLog;
  });
}

export async function clearAllData() {
  return retryStorageWrite('clearAllData', async () => {
    await AsyncStorage.multiRemove([
      KEYS.STREAK_START,
      KEYS.URGE_LOGS,
      KEYS.DAILY_SAVINGS,
    ]);
    return true;
  });
}

export function getMostFrequentTrigger(logs) {
  if (!logs.length) {
    return null;
  }

  const counts = {};
  logs.forEach((log) => {
    if (log.trigger) {
      counts[log.trigger] = (counts[log.trigger] || 0) + 1;
    }
  });

  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}

export function getPeakUrgeHour(logs) {
  if (!logs.length) {
    return null;
  }

  const counts = {};
  logs.forEach((log) => {
    if (log.hour !== undefined) {
      counts[log.hour] = (counts[log.hour] || 0) + 1;
    }
  });

  const hour = Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0];
  if (hour === undefined) {
    return null;
  }

  const numericHour = Number.parseInt(hour, 10);
  const suffix = numericHour >= 12 ? 'PM' : 'AM';
  const displayHour =
    numericHour === 0 ? 12 : numericHour > 12 ? numericHour - 12 : numericHour;

  return `${displayHour}:00 ${suffix}`;
}
