import AsyncStorage from '@react-native-async-storage/async-storage';
import { SleepEntry, SleepState } from '../types/sleep';

const SLEEP_ENTRIES_KEY = 'sleep_entries';
const CURRENT_STATE_KEY = 'current_sleep_state';
const CURRENT_SLEEP_START_KEY = 'current_sleep_start';

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
