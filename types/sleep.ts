export interface SleepEntry {
  id: string;
  sleepTime: string; // ISO string
  wakeTime: string | null; // ISO string, null if still sleeping
  notes: string;
  createdAt: string;
}

export interface SleepStats {
  averageDuration: number; // minutes
  totalEntries: number;
  sleepScore: number; // 0-100
  consistency: number; // 0-100, how consistent sleep times are
}

export type SleepState = 'awake' | 'sleeping';

export interface DailySleepData {
  date: string; // YYYY-MM-DD
  duration: number; // minutes
  sleepTime: string;
  wakeTime: string;
}
