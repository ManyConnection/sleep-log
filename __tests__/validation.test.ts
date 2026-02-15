/**
 * Input validation tests
 * Tests edge cases and validation behaviors across the app
 */

import { formatAmount, calculatePercentage } from '../utils';
import { calculateSleepDuration, calculateSleepScore, formatDuration } from '../utils/sleepScore';

describe('Input Validation', () => {
  describe('Amount validation edge cases', () => {
    it('should handle negative amounts in formatAmount', () => {
      // Negative amounts should still format (even if invalid in UI)
      expect(formatAmount(-100)).toBe('-100ml');
    });

    it('should handle very large amounts', () => {
      expect(formatAmount(10000)).toBe('10.0L');
      expect(formatAmount(99999)).toBe('100.0L');
    });

    it('should handle zero amount', () => {
      expect(formatAmount(0)).toBe('0ml');
    });

    it('should handle decimal amounts (rounded by JS)', () => {
      expect(formatAmount(100.5)).toBe('100.5ml');
      expect(formatAmount(1500.5)).toBe('1.5L');
    });
  });

  describe('Percentage validation edge cases', () => {
    it('should handle negative current value (returns negative percentage)', () => {
      // Note: App UI should prevent negative values, function returns raw calculation
      expect(calculatePercentage(-100, 2000)).toBe(-5);
    });

    it('should handle very large values', () => {
      expect(calculatePercentage(100000, 2000)).toBe(100);
    });

    it('should handle equal current and goal', () => {
      expect(calculatePercentage(2000, 2000)).toBe(100);
    });

    it('should handle floating point precision', () => {
      // 1/3 should round properly
      expect(calculatePercentage(1, 3)).toBe(33);
      expect(calculatePercentage(2, 3)).toBe(67);
    });
  });

  describe('Sleep duration validation', () => {
    it('should handle same sleep and wake time', () => {
      const time = '2026-02-11T00:00:00.000Z';
      expect(calculateSleepDuration(time, time)).toBe(0);
    });

    it('should handle wake time before sleep time (negative duration)', () => {
      const sleepTime = '2026-02-11T08:00:00.000Z';
      const wakeTime = '2026-02-11T06:00:00.000Z';
      // Negative duration should be handled
      const duration = calculateSleepDuration(sleepTime, wakeTime);
      expect(duration).toBeLessThan(0);
    });

    it('should handle very long sleep (24+ hours)', () => {
      const sleepTime = '2026-02-10T00:00:00.000Z';
      const wakeTime = '2026-02-12T00:00:00.000Z';
      expect(calculateSleepDuration(sleepTime, wakeTime)).toBe(2880); // 48 hours
    });
  });

  describe('Sleep score validation', () => {
    it('should handle entry with null notes', () => {
      const entries = [{
        id: '1',
        sleepTime: '2026-02-10T23:00:00.000Z',
        wakeTime: '2026-02-11T07:00:00.000Z',
        notes: null as unknown as string,
        createdAt: '2026-02-10T23:00:00.000Z',
      }];
      // Should not throw
      expect(() => calculateSleepScore(entries)).not.toThrow();
    });

    it('should handle entries array with mixed valid/invalid entries', () => {
      const entries = [
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
          wakeTime: null,
          notes: '',
          createdAt: '2026-02-09T23:00:00.000Z',
        },
      ];
      // Should handle gracefully
      const score = calculateSleepScore(entries);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Duration format validation', () => {
    it('should handle zero minutes', () => {
      expect(formatDuration(0)).toBe('0時間0分');
    });

    it('should handle negative minutes', () => {
      // Function behavior for negative input
      expect(formatDuration(-60)).toBe('-1時間0分');
    });

    it('should handle very large duration', () => {
      expect(formatDuration(1440)).toBe('24時間0分'); // 24 hours
      expect(formatDuration(10080)).toBe('168時間0分'); // 1 week
    });
  });
});

describe('Empty data handling', () => {
  it('formatAmount should handle undefined/NaN', () => {
    expect(formatAmount(NaN)).toBe('NaNml');
    expect(formatAmount(undefined as unknown as number)).toBe('undefinedml');
  });

  it('calculatePercentage returns NaN for NaN inputs (edge case)', () => {
    // Note: App UI should prevent NaN values - these are just documenting behavior
    expect(calculatePercentage(NaN, 2000)).toBeNaN();
    expect(calculatePercentage(100, NaN)).toBeNaN();
  });
});
