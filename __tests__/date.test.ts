import {
  formatDateKey,
  getTodayKey,
  formatDisplayDate,
  formatTime,
  getWeekRange,
  getMonthRange,
  getDaysInRange,
  getLastNDays,
  checkIsToday,
  getMonthName,
  getDayOfWeek,
} from '../utils/date';

describe('date utilities', () => {
  describe('formatDateKey', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2026-02-11T12:00:00');
      expect(formatDateKey(date)).toBe('2026-02-11');
    });

    it('should handle different dates', () => {
      expect(formatDateKey(new Date('2026-01-01T00:00:00'))).toBe('2026-01-01');
      expect(formatDateKey(new Date('2026-12-31T23:59:59'))).toBe('2026-12-31');
    });
  });

  describe('getTodayKey', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const result = getTodayKey();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatDisplayDate', () => {
    it('should format Date object in Japanese', () => {
      const date = new Date('2026-02-11T12:00:00');
      const result = formatDisplayDate(date);
      expect(result).toMatch(/2月11日/);
    });

    it('should handle string input', () => {
      const result = formatDisplayDate('2026-02-11');
      expect(result).toMatch(/2月11日/);
    });
  });

  describe('formatTime', () => {
    it('should format timestamp as HH:mm', () => {
      const timestamp = new Date('2026-02-11T14:30:00').getTime();
      expect(formatTime(timestamp)).toBe('14:30');
    });

    it('should pad single digits', () => {
      const timestamp = new Date('2026-02-11T08:05:00').getTime();
      expect(formatTime(timestamp)).toBe('08:05');
    });
  });

  describe('getWeekRange', () => {
    it('should return start and end of week', () => {
      const date = new Date('2026-02-11T12:00:00'); // Wednesday
      const { start, end } = getWeekRange(date);
      expect(formatDateKey(start)).toBe('2026-02-09'); // Monday
      expect(formatDateKey(end)).toBe('2026-02-15'); // Sunday
    });
  });

  describe('getMonthRange', () => {
    it('should return start and end of month', () => {
      const date = new Date('2026-02-11T12:00:00');
      const { start, end } = getMonthRange(date);
      expect(formatDateKey(start)).toBe('2026-02-01');
      expect(formatDateKey(end)).toBe('2026-02-28');
    });
  });

  describe('getDaysInRange', () => {
    it('should return all days in range', () => {
      const start = new Date('2026-02-10T00:00:00');
      const end = new Date('2026-02-13T00:00:00');
      const days = getDaysInRange(start, end);
      expect(days).toHaveLength(4);
    });
  });

  describe('getLastNDays', () => {
    it('should return array of N days', () => {
      const days = getLastNDays(7);
      expect(days).toHaveLength(7);
    });

    it('should return dates in chronological order', () => {
      const days = getLastNDays(3);
      expect(days[0].getTime()).toBeLessThan(days[1].getTime());
      expect(days[1].getTime()).toBeLessThan(days[2].getTime());
    });
  });

  describe('checkIsToday', () => {
    it('should return true for today', () => {
      expect(checkIsToday(new Date())).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(checkIsToday(yesterday)).toBe(false);
    });

    it('should handle string input', () => {
      const today = formatDateKey(new Date());
      expect(checkIsToday(today)).toBe(true);
    });
  });

  describe('getMonthName', () => {
    it('should return Japanese month format', () => {
      const date = new Date('2026-02-11T12:00:00');
      expect(getMonthName(date)).toBe('2026年2月');
    });
  });

  describe('getDayOfWeek', () => {
    it('should return Japanese day of week', () => {
      const date = new Date('2026-02-11T12:00:00'); // Wednesday
      const result = getDayOfWeek(date);
      expect(result).toBe('水');
    });
  });
});
