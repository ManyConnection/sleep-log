import {
  calculateSleepDuration,
  calculateSleepScore,
  calculateConsistency,
  calculateStats,
  formatDuration,
  formatTime,
  getScoreEmoji,
  getScoreColor,
  getDailySleepData,
} from '../utils/sleepScore';
import { SleepEntry } from '../types/sleep';

describe('sleepScore utilities', () => {
  describe('calculateSleepDuration', () => {
    it('should calculate duration in minutes correctly', () => {
      const sleepTime = '2026-02-10T23:00:00.000Z';
      const wakeTime = '2026-02-11T07:00:00.000Z';
      expect(calculateSleepDuration(sleepTime, wakeTime)).toBe(480); // 8 hours
    });

    it('should handle short sleep duration', () => {
      const sleepTime = '2026-02-11T02:00:00.000Z';
      const wakeTime = '2026-02-11T06:00:00.000Z';
      expect(calculateSleepDuration(sleepTime, wakeTime)).toBe(240); // 4 hours
    });

    it('should handle long sleep duration', () => {
      const sleepTime = '2026-02-10T21:00:00.000Z';
      const wakeTime = '2026-02-11T09:00:00.000Z';
      expect(calculateSleepDuration(sleepTime, wakeTime)).toBe(720); // 12 hours
    });
  });

  describe('calculateSleepScore', () => {
    it('should return 0 for empty entries', () => {
      expect(calculateSleepScore([])).toBe(0);
    });

    it('should return 0 for entries without wake times', () => {
      const entries: SleepEntry[] = [
        {
          id: '1',
          sleepTime: '2026-02-10T23:00:00.000Z',
          wakeTime: null,
          notes: '',
          createdAt: '2026-02-10T23:00:00.000Z',
        },
      ];
      expect(calculateSleepScore(entries)).toBe(0);
    });

    it('should calculate score for ideal sleep', () => {
      const entries: SleepEntry[] = [
        {
          id: '1',
          sleepTime: '2026-02-10T22:30:00.000Z', // 22:30
          wakeTime: '2026-02-11T06:30:00.000Z', // 06:30 = 8 hours
          notes: '',
          createdAt: '2026-02-10T22:30:00.000Z',
        },
      ];
      const score = calculateSleepScore(entries);
      // Score depends on ideal duration (8h) + timing + consistency
      expect(score).toBeGreaterThanOrEqual(70);
    });

    it('should give lower score for short sleep', () => {
      const shortSleep: SleepEntry[] = [
        {
          id: '1',
          sleepTime: '2026-02-11T02:00:00.000Z',
          wakeTime: '2026-02-11T06:00:00.000Z', // 4 hours
          notes: '',
          createdAt: '2026-02-11T02:00:00.000Z',
        },
      ];
      const idealSleep: SleepEntry[] = [
        {
          id: '2',
          sleepTime: '2026-02-10T23:00:00.000Z',
          wakeTime: '2026-02-11T07:00:00.000Z', // 8 hours
          notes: '',
          createdAt: '2026-02-10T23:00:00.000Z',
        },
      ];
      
      const shortScore = calculateSleepScore(shortSleep);
      const idealScore = calculateSleepScore(idealSleep);
      expect(shortScore).toBeLessThan(idealScore);
    });
  });

  describe('calculateConsistency', () => {
    it('should return 0 for less than 2 entries', () => {
      expect(calculateConsistency([])).toBe(0);
      expect(calculateConsistency([{
        id: '1',
        sleepTime: '2026-02-10T23:00:00.000Z',
        wakeTime: '2026-02-11T07:00:00.000Z',
        notes: '',
        createdAt: '2026-02-10T23:00:00.000Z',
      }])).toBe(0);
    });

    it('should give high consistency for regular sleep times', () => {
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
      const consistency = calculateConsistency(entries);
      expect(consistency).toBe(100);
    });
  });

  describe('calculateStats', () => {
    it('should return zeros for empty entries', () => {
      const stats = calculateStats([]);
      expect(stats.averageDuration).toBe(0);
      expect(stats.totalEntries).toBe(0);
      expect(stats.sleepScore).toBe(0);
      expect(stats.consistency).toBe(0);
    });

    it('should calculate correct average duration', () => {
      const entries: SleepEntry[] = [
        {
          id: '1',
          sleepTime: '2026-02-10T23:00:00.000Z',
          wakeTime: '2026-02-11T07:00:00.000Z', // 8 hours
          notes: '',
          createdAt: '2026-02-10T23:00:00.000Z',
        },
        {
          id: '2',
          sleepTime: '2026-02-09T22:00:00.000Z',
          wakeTime: '2026-02-10T06:00:00.000Z', // 8 hours
          notes: '',
          createdAt: '2026-02-09T22:00:00.000Z',
        },
      ];
      const stats = calculateStats(entries);
      expect(stats.averageDuration).toBe(480);
      expect(stats.totalEntries).toBe(2);
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(formatDuration(480)).toBe('8時間0分');
      expect(formatDuration(450)).toBe('7時間30分');
      expect(formatDuration(90)).toBe('1時間30分');
      expect(formatDuration(30)).toBe('0時間30分');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      expect(formatTime('2026-02-11T07:30:00.000Z')).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('getScoreEmoji', () => {
    it('should return appropriate emoji for score ranges', () => {
      expect(getScoreEmoji(90)).toBe('😴💯');
      expect(getScoreEmoji(70)).toBe('😊');
      expect(getScoreEmoji(50)).toBe('😐');
      expect(getScoreEmoji(30)).toBe('😰');
      expect(getScoreEmoji(10)).toBe('😵');
    });
  });

  describe('getScoreColor', () => {
    it('should return appropriate color for score ranges', () => {
      expect(getScoreColor(90)).toBe('#4CAF50');
      expect(getScoreColor(70)).toBe('#8BC34A');
      expect(getScoreColor(50)).toBe('#FFC107');
      expect(getScoreColor(30)).toBe('#FF9800');
      expect(getScoreColor(10)).toBe('#F44336');
    });
  });

  describe('getDailySleepData', () => {
    it('should return data for specified number of days', () => {
      const entries: SleepEntry[] = [];
      const data = getDailySleepData(entries, 7);
      expect(data).toHaveLength(7);
    });

    it('should return zero duration for days without entries', () => {
      const data = getDailySleepData([], 7);
      data.forEach(d => {
        expect(d.duration).toBe(0);
      });
    });
  });
});
