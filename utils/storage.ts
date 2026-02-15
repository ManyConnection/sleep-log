import AsyncStorage from '@react-native-async-storage/async-storage';
import { SleepEntry, SleepState } from '../types/sleep';
import { DrinkRecord, AppSettings } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';

const SLEEP_ENTRIES_KEY = 'sleep_entries';
const CURRENT_STATE_KEY = 'current_sleep_state';
const CURRENT_SLEEP_START_KEY = 'current_sleep_start';

// ============ Water/Drink Records ============

export async function loadRecords(): Promise<DrinkRecord[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading records:', error);
    return [];
  }
}

export async function saveRecords(records: DrinkRecord[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving records:', error);
    throw error;
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

// ============ Sleep Entries ============

export async function getSleepEntries(): Promise<SleepEntry[]> {
  try {
    const data = await AsyncStorage.getItem(SLEEP_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading sleep entries:', error);
    return [];
  }
}

export async function saveSleepEntry(entry: SleepEntry): Promise<void> {
  try {
    const entries = await getSleepEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.unshift(entry);
    }
    
    await AsyncStorage.setItem(SLEEP_ENTRIES_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving sleep entry:', error);
    throw error;
  }
}

export async function deleteSleepEntry(id: string): Promise<void> {
  try {
    const entries = await getSleepEntries();
    const filtered = entries.filter(e => e.id !== id);
    await AsyncStorage.setItem(SLEEP_ENTRIES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting sleep entry:', error);
    throw error;
  }
}

export async function getCurrentSleepState(): Promise<SleepState> {
  try {
    const state = await AsyncStorage.getItem(CURRENT_STATE_KEY);
    return (state as SleepState) || 'awake';
  } catch (error) {
    return 'awake';
  }
}

export async function setCurrentSleepState(state: SleepState): Promise<void> {
  await AsyncStorage.setItem(CURRENT_STATE_KEY, state);
}

export async function getCurrentSleepStart(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(CURRENT_SLEEP_START_KEY);
  } catch (error) {
    return null;
  }
}

export async function setCurrentSleepStart(time: string | null): Promise<void> {
  if (time) {
    await AsyncStorage.setItem(CURRENT_SLEEP_START_KEY, time);
  } else {
    await AsyncStorage.removeItem(CURRENT_SLEEP_START_KEY);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
