import { generateId, formatAmount, calculatePercentage } from '../utils';

describe('utility functions', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });

    it('should generate non-empty string IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate different IDs on consecutive calls', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('formatAmount', () => {
    it('should format ml amounts correctly', () => {
      expect(formatAmount(100)).toBe('100ml');
      expect(formatAmount(500)).toBe('500ml');
      expect(formatAmount(999)).toBe('999ml');
    });

    it('should format amounts >= 1000ml as liters', () => {
      expect(formatAmount(1000)).toBe('1.0L');
      expect(formatAmount(1500)).toBe('1.5L');
      expect(formatAmount(2000)).toBe('2.0L');
      expect(formatAmount(2500)).toBe('2.5L');
    });

    it('should handle edge cases', () => {
      expect(formatAmount(0)).toBe('0ml');
      expect(formatAmount(1)).toBe('1ml');
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(500, 2000)).toBe(25);
      expect(calculatePercentage(1000, 2000)).toBe(50);
      expect(calculatePercentage(2000, 2000)).toBe(100);
    });

    it('should cap at 100%', () => {
      expect(calculatePercentage(2500, 2000)).toBe(100);
      expect(calculatePercentage(5000, 2000)).toBe(100);
    });

    it('should return 0 for zero or negative goal', () => {
      expect(calculatePercentage(100, 0)).toBe(0);
      expect(calculatePercentage(100, -100)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(calculatePercentage(333, 1000)).toBe(33);
      expect(calculatePercentage(666, 1000)).toBe(67);
    });

    it('should handle zero current', () => {
      expect(calculatePercentage(0, 2000)).toBe(0);
    });
  });
});
