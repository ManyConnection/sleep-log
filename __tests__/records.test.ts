import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadRecords,
  saveRecords,
  loadSettings,
  saveSettings,
} from '../utils/storage';
import { DrinkRecord, AppSettings } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';

// Reset mock before each test
beforeEach(() => {
  (AsyncStorage.clear as jest.Mock)();
  (AsyncStorage.getItem as jest.Mock).mockReset();
  (AsyncStorage.setItem as jest.Mock).mockReset();
  (AsyncStorage.removeItem as jest.Mock).mockReset();
  
  // Set default resolved values
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
});

describe('Water/Drink Records Storage', () => {
  describe('loadRecords', () => {
    it('should return empty array when no records exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const records = await loadRecords();
      expect(records).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.RECORDS);
    });

    it('should return parsed records when they exist', async () => {
      const mockRecords: DrinkRecord[] = [
        {
          id: '1',
          type: 'water',
          amount: 200,
          timestamp: 1707634800000,
          date: '2026-02-11',
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockRecords));
      
      const records = await loadRecords();
      expect(records).toEqual(mockRecords);
    });

    it('should handle JSON parse errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');
      const records = await loadRecords();
      expect(records).toEqual([]);
    });

    it('should handle storage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      const records = await loadRecords();
      expect(records).toEqual([]);
    });
  });

  describe('saveRecords', () => {
    it('should save records to AsyncStorage', async () => {
      const records: DrinkRecord[] = [
        {
          id: '1',
          type: 'water',
          amount: 200,
          timestamp: 1707634800000,
          date: '2026-02-11',
        },
      ];
      
      await saveRecords(records);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.RECORDS,
        JSON.stringify(records)
      );
    });

    it('should save empty array', async () => {
      await saveRecords([]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.RECORDS,
        '[]'
      );
    });

    it('should throw error on storage failure', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      
      await expect(saveRecords([])).rejects.toThrow('Storage error');
    });
  });

  describe('data persistence flow', () => {
    it('should save and reload records correctly', async () => {
      const records: DrinkRecord[] = [
        { id: '1', type: 'water', amount: 200, timestamp: 1000, date: '2026-02-11' },
        { id: '2', type: 'tea', amount: 250, timestamp: 2000, date: '2026-02-11' },
      ];

      // Save
      await saveRecords(records);
      
      // Mock the reload to return what was saved
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData);
      
      // Reload
      const loaded = await loadRecords();
      expect(loaded).toEqual(records);
    });
  });
});

describe('Settings Storage', () => {
  describe('loadSettings', () => {
    it('should return DEFAULT_SETTINGS when no settings exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const settings = await loadSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it('should return parsed settings when they exist', async () => {
      const mockSettings: AppSettings = {
        dailyGoal: 2500,
        notificationsEnabled: false,
        reminders: [],
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockSettings));
      
      const settings = await loadSettings();
      expect(settings).toEqual(mockSettings);
    });

    it('should handle JSON parse errors and return defaults', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('not valid json');
      const settings = await loadSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it('should handle storage errors and return defaults', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      const settings = await loadSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('saveSettings', () => {
    it('should save settings to AsyncStorage', async () => {
      const settings: AppSettings = {
        dailyGoal: 2500,
        notificationsEnabled: true,
        reminders: [],
      };
      
      await saveSettings(settings);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
    });

    it('should throw error on storage failure', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      
      await expect(saveSettings(DEFAULT_SETTINGS)).rejects.toThrow('Storage error');
    });
  });

  describe('settings persistence flow', () => {
    it('should save and reload settings correctly', async () => {
      const settings: AppSettings = {
        dailyGoal: 3000,
        notificationsEnabled: true,
        reminders: [
          { id: '1', time: '10:00', enabled: true, days: [1, 2, 3] },
        ],
      };

      // Save
      await saveSettings(settings);
      
      // Mock the reload
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData);
      
      // Reload
      const loaded = await loadSettings();
      expect(loaded).toEqual(settings);
    });
  });
});
