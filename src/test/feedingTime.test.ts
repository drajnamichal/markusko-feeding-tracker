import { describe, it, expect } from 'vitest';
import type { LogEntry } from '../../types';

describe('Feeding Time Calculations', () => {
  const createMockEntry = (overrides: Partial<LogEntry>): LogEntry => ({
    id: 'test-id',
    dateTime: new Date(),
    poop: false,
    pee: false,
    breastMilkMl: 0,
    breastfed: false,
    formulaMl: 0,
    vomit: false,
    vitaminD: false,
    tummyTime: false,
    sterilization: false,
    bathing: false,
    notes: '',
    ...overrides,
  });

  describe('Last feeding time', () => {
    it('should find most recent feeding', () => {
      const now = new Date('2025-10-17T12:00:00Z');
      const twoHoursAgo = new Date('2025-10-17T10:00:00Z');
      const fourHoursAgo = new Date('2025-10-17T08:00:00Z');

      const entries: LogEntry[] = [
        createMockEntry({ breastMilkMl: 60, dateTime: fourHoursAgo }),
        createMockEntry({ formulaMl: 60, dateTime: twoHoursAgo }),
        createMockEntry({ poop: true, dateTime: now }), // Not a feeding
      ];

      const feedings = entries
        .filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      expect(feedings[0].dateTime).toEqual(twoHoursAgo);
    });

    it('should calculate time since last feeding', () => {
      const now = new Date('2025-10-17T12:00:00Z');
      const lastFeedingTime = new Date('2025-10-17T10:00:00Z'); // 2 hours ago

      const diff = now.getTime() - lastFeedingTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      expect(hours).toBe(2);
      expect(minutes).toBe(0);
    });

    it('should handle partial hours', () => {
      const now = new Date('2025-10-17T12:30:00Z');
      const lastFeedingTime = new Date('2025-10-17T10:15:00Z'); // 2h 15m ago

      const diff = now.getTime() - lastFeedingTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      expect(hours).toBe(2);
      expect(minutes).toBe(15);
    });

    it('should handle recent feeding (less than 1 hour)', () => {
      const now = new Date('2025-10-17T12:30:00Z');
      const lastFeedingTime = new Date('2025-10-17T12:15:00Z'); // 15m ago

      const diff = now.getTime() - lastFeedingTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      expect(hours).toBe(0);
      expect(minutes).toBe(15);
    });
  });

  describe('Next feeding time', () => {
    it('should calculate next feeding time (2 hours after last)', () => {
      const lastFeedingTime = new Date('2025-10-17T10:00:00Z');
      const nextFeedingTime = new Date(lastFeedingTime.getTime() + (2 * 60 * 60 * 1000));

      expect(nextFeedingTime.getUTCHours()).toBe(12);
      expect(nextFeedingTime.getUTCMinutes()).toBe(0);
    });

    it('should handle feeding across midnight', () => {
      const lastFeedingTime = new Date('2025-10-17T22:30:00Z');
      const nextFeedingTime = new Date(lastFeedingTime.getTime() + (2 * 60 * 60 * 1000));

      expect(nextFeedingTime.getUTCDate()).toBe(18);
      expect(nextFeedingTime.getUTCHours()).toBe(0);
      expect(nextFeedingTime.getUTCMinutes()).toBe(30);
    });
  });

  describe('Average feeding interval', () => {
    it('should calculate average interval between feedings', () => {
      const entries: LogEntry[] = [
        createMockEntry({ 
          breastMilkMl: 60, 
          dateTime: new Date('2025-10-17T08:00:00Z') 
        }),
        createMockEntry({ 
          formulaMl: 60, 
          dateTime: new Date('2025-10-17T11:00:00Z') // 3h later
        }),
        createMockEntry({ 
          breastMilkMl: 60, 
          dateTime: new Date('2025-10-17T14:30:00Z') // 3.5h later
        }),
      ];

      const feedingTimes = entries
        .filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0)
        .map(e => e.dateTime.getTime())
        .sort((a, b) => a - b);

      const intervals: number[] = [];
      for (let i = 1; i < feedingTimes.length; i++) {
        intervals.push(feedingTimes[i] - feedingTimes[i - 1]);
      }

      const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const avgIntervalHours = avgInterval / (1000 * 60 * 60);

      expect(intervals.length).toBe(2);
      expect(avgIntervalHours).toBe(3.25); // Average of 3h and 3.5h
    });

    it('should return 0 for single feeding', () => {
      const entries: LogEntry[] = [
        createMockEntry({ breastMilkMl: 60, dateTime: new Date() }),
      ];

      const feedingTimes = entries
        .filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0)
        .map(e => e.dateTime.getTime())
        .sort((a, b) => a - b);

      const intervals: number[] = [];
      for (let i = 1; i < feedingTimes.length; i++) {
        intervals.push(feedingTimes[i] - feedingTimes[i - 1]);
      }

      expect(intervals.length).toBe(0);
    });
  });

  describe('Feeding notification timing', () => {
    it('should trigger notification at 2 hours', () => {
      const lastFeedingTime = new Date('2025-10-17T10:00:00Z');
      const currentTime = new Date('2025-10-17T12:00:00Z'); // Exactly 2 hours

      const hoursSinceLastFeeding = 
        (currentTime.getTime() - lastFeedingTime.getTime()) / (1000 * 60 * 60);

      const shouldNotify = hoursSinceLastFeeding >= 2 && hoursSinceLastFeeding < 2.02;

      expect(hoursSinceLastFeeding).toBe(2);
      expect(shouldNotify).toBe(true);
    });

    it('should not trigger notification before 2 hours', () => {
      const lastFeedingTime = new Date('2025-10-17T10:00:00Z');
      const currentTime = new Date('2025-10-17T11:30:00Z'); // 1.5 hours

      const hoursSinceLastFeeding = 
        (currentTime.getTime() - lastFeedingTime.getTime()) / (1000 * 60 * 60);

      const shouldNotify = hoursSinceLastFeeding >= 2 && hoursSinceLastFeeding < 2.02;

      expect(hoursSinceLastFeeding).toBe(1.5);
      expect(shouldNotify).toBe(false);
    });

    it('should not trigger duplicate notification after time window', () => {
      const lastFeedingTime = new Date('2025-10-17T10:00:00Z');
      const currentTime = new Date('2025-10-17T12:05:00Z'); // 2h 5m (outside window)

      const hoursSinceLastFeeding = 
        (currentTime.getTime() - lastFeedingTime.getTime()) / (1000 * 60 * 60);

      const shouldNotify = hoursSinceLastFeeding >= 2 && hoursSinceLastFeeding < 2.02;

      expect(hoursSinceLastFeeding).toBeGreaterThan(2.02);
      expect(shouldNotify).toBe(false);
    });
  });

  describe('Bottle feeding detection', () => {
    it('should identify bottle feeding with breast milk', () => {
      const entry = createMockEntry({ breastMilkMl: 60 });
      
      const isBottleFeeding = entry.breastMilkMl > 0 || entry.formulaMl > 0;

      expect(isBottleFeeding).toBe(true);
    });

    it('should identify bottle feeding with formula', () => {
      const entry = createMockEntry({ formulaMl: 60 });
      
      const isBottleFeeding = entry.breastMilkMl > 0 || entry.formulaMl > 0;

      expect(isBottleFeeding).toBe(true);
    });

    it('should identify combined bottle feeding', () => {
      const entry = createMockEntry({ breastMilkMl: 30, formulaMl: 30 });
      
      const isBottleFeeding = entry.breastMilkMl > 0 || entry.formulaMl > 0;
      const totalMl = entry.breastMilkMl + entry.formulaMl;

      expect(isBottleFeeding).toBe(true);
      expect(totalMl).toBe(60);
    });

    it('should not identify breastfed without bottle as bottle feeding', () => {
      const entry = createMockEntry({ breastfed: true, breastMilkMl: 0, formulaMl: 0 });
      
      const isBottleFeeding = entry.breastMilkMl > 0 || entry.formulaMl > 0;

      expect(isBottleFeeding).toBe(false);
    });
  });
});

