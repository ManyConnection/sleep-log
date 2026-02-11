import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSleepEntries,
  saveSleepEntry,
  deleteSleepEntry,
  getCurrentSleepState,
  setCurrentSleepState,
  getCurrentSleepStart,
  setCurrentSleepStart,
  generateId,
} from '../utils/storage';
import { SleepEntry } from '../types/sleep';

// Reset mock before each test
beforeEach(() => {
  (AsyncStorage.clear as jest.Mock)();
});

describe('storage utilities', () => {
  describe('getSleepEntries', () => {
    it('should return empty array when no entries exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const entries = await getSleepEntries();
      expect(entries).toEqual([]);
    });

    it('should return parsed entries when they exist', async () => {
      const mockEntries: SleepEntry[] = [
        {
          id: '1',
          sleepTime: '2026-02-10T23:00:00.000Z',
          wakeTime: '2026-02-11T07:00:00.000Z',
          notes: 'Good sleep',
          createdAt: '2026-02-10T23:00:00.000Z',
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockEntries));
      
      const entries = await getSleepEntries();
      expect(entries).toEqual(mockEntries);
    });

    it('should handle JSON parse errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');
      const entries = await getSleepEntries();
      expect(entries).toEqual([]);
    });
  });

  describe('saveSleepEntry', () => {
    it('should save a new entry', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
      
      const newEntry: SleepEntry = {
        id: '1',
        sleepTime: '2026-02-10T23:00:00.000Z',
        wakeTime: '2026-02-11T07:00:00.000Z',
        notes: '',
        createdAt: '2026-02-10T23:00:00.000Z',
      };
      
      await saveSleepEntry(newEntry);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'sleep_entries',
        JSON.stringify([newEntry])
      );
    });

    it('should update an existing entry', async () => {
      const existingEntry: SleepEntry = {
        id: '1',
        sleepTime: '2026-02-10T23:00:00.000Z',
        wakeTime: '2026-02-11T07:00:00.000Z',
        notes: '',
        createdAt: '2026-02-10T23:00:00.000Z',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingEntry]));
      
      const updatedEntry = { ...existingEntry, notes: 'Had a dream' };
      await saveSleepEntry(updatedEntry);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'sleep_entries',
        JSON.stringify([updatedEntry])
      );
    });
  });

  describe('deleteSleepEntry', () => {
    it('should delete an entry by id', async () => {
      const entries: SleepEntry[] = [
        {
          id: '1',
          sleepTime: '2026-02-10T23:00:00.000Z',
          wakeTime: '2026-02-11T07:00:00.000Z',
          notes: '',
          createdAt: '2026-02-10T23:00:00.000Z',
        },
        {
          id: '2',
          sleepTime: '2026-02-09T23:00:00.000Z',
          wakeTime: '2026-02-10T07:00:00.000Z',
          notes: '',
          createdAt: '2026-02-09T23:00:00.000Z',
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(entries));
      
      await deleteSleepEntry('1');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'sleep_entries',
        JSON.stringify([entries[1]])
      );
    });
  });

  describe('getCurrentSleepState', () => {
    it('should return "awake" when no state is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const state = await getCurrentSleepState();
      expect(state).toBe('awake');
    });

    it('should return the stored state', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('sleeping');
      const state = await getCurrentSleepState();
      expect(state).toBe('sleeping');
    });
  });

  describe('setCurrentSleepState', () => {
    it('should save the sleep state', async () => {
      await setCurrentSleepState('sleeping');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('current_sleep_state', 'sleeping');
    });
  });

  describe('getCurrentSleepStart', () => {
    it('should return null when no start time is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const start = await getCurrentSleepStart();
      expect(start).toBeNull();
    });

    it('should return the stored start time', async () => {
      const mockTime = '2026-02-10T23:00:00.000Z';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockTime);
      const start = await getCurrentSleepStart();
      expect(start).toBe(mockTime);
    });
  });

  describe('setCurrentSleepStart', () => {
    it('should save the start time', async () => {
      const mockTime = '2026-02-10T23:00:00.000Z';
      await setCurrentSleepStart(mockTime);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('current_sleep_start', mockTime);
    });

    it('should remove the start time when null is passed', async () => {
      await setCurrentSleepStart(null);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('current_sleep_start');
    });
  });

  describe('generateId', () => {
    it('should generate unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate non-empty string ids', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });
});
