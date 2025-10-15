import { describe, it, expect } from 'vitest';
import type { LogEntry } from '../../types';

describe('Statistics calculations', () => {
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
    notes: '',
    ...overrides,
  });

  describe('Feeding count', () => {
    it('should count breastfed entries', () => {
      const entries: LogEntry[] = [
        createMockEntry({ breastfed: true }),
        createMockEntry({ breastfed: true }),
        createMockEntry({ breastfed: false }),
      ];

      const breastfedCount = entries.filter(e => e.breastfed).length;
      expect(breastfedCount).toBe(2);
    });

    it('should count total feedings (breastfed OR bottle)', () => {
      const entries: LogEntry[] = [
        createMockEntry({ breastfed: true }),
        createMockEntry({ breastMilkMl: 60 }),
        createMockEntry({ formulaMl: 60 }),
        createMockEntry({ breastfed: true, formulaMl: 30 }), // Combined feeding = 1 entry
        createMockEntry({ poop: true }), // No feeding
      ];

      const totalFeedings = entries.filter(
        e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0
      ).length;
      
      expect(totalFeedings).toBe(4);
    });

    it('should count combined feeding as one entry', () => {
      const entries: LogEntry[] = [
        createMockEntry({ 
          breastfed: true, 
          formulaMl: 60,
          dateTime: new Date('2025-10-15T08:20:00Z')
        }),
      ];

      const totalFeedings = entries.filter(
        e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0
      ).length;
      
      // Combined breastfed + formula in ONE entry = 1 feeding
      expect(totalFeedings).toBe(1);
    });
  });

  describe('Total ml calculation', () => {
    it('should sum breast milk and formula', () => {
      const entries: LogEntry[] = [
        createMockEntry({ breastMilkMl: 60 }),
        createMockEntry({ formulaMl: 60 }),
        createMockEntry({ breastMilkMl: 30, formulaMl: 30 }),
      ];

      const totalMl = entries.reduce(
        (sum, e) => sum + e.breastMilkMl + e.formulaMl, 
        0
      );
      
      expect(totalMl).toBe(180);
    });

    it('should handle zero values', () => {
      const entries: LogEntry[] = [
        createMockEntry({ breastfed: true, breastMilkMl: 0, formulaMl: 0 }),
      ];

      const totalMl = entries.reduce(
        (sum, e) => sum + e.breastMilkMl + e.formulaMl, 
        0
      );
      
      expect(totalMl).toBe(0);
    });
  });

  describe('Activity counts', () => {
    it('should count poop entries', () => {
      const entries: LogEntry[] = [
        createMockEntry({ poop: true }),
        createMockEntry({ poop: true }),
        createMockEntry({ poop: false }),
      ];

      const poopCount = entries.filter(e => e.poop).length;
      expect(poopCount).toBe(2);
    });

    it('should count pee entries', () => {
      const entries: LogEntry[] = [
        createMockEntry({ pee: true }),
        createMockEntry({ pee: true }),
        createMockEntry({ pee: true }),
      ];

      const peeCount = entries.filter(e => e.pee).length;
      expect(peeCount).toBe(3);
    });

    it('should count vomit entries', () => {
      const entries: LogEntry[] = [
        createMockEntry({ vomit: true }),
        createMockEntry({ vomit: false }),
      ];

      const vomitCount = entries.filter(e => e.vomit).length;
      expect(vomitCount).toBe(1);
    });

    it('should count vitamin D entries', () => {
      const entries: LogEntry[] = [
        createMockEntry({ vitaminD: true }),
        createMockEntry({ vitaminD: false }),
      ];

      const vitaminDCount = entries.filter(e => e.vitaminD).length;
      expect(vitaminDCount).toBe(1);
    });

    it('should count tummy time entries', () => {
      const entries: LogEntry[] = [
        createMockEntry({ tummyTime: true }),
        createMockEntry({ tummyTime: true }),
        createMockEntry({ tummyTime: true }),
        createMockEntry({ tummyTime: false }),
      ];

      const tummyTimeCount = entries.filter(e => e.tummyTime).length;
      expect(tummyTimeCount).toBe(3);
    });
  });

  describe('Date filtering', () => {
    it('should filter entries for today', () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const entries: LogEntry[] = [
        createMockEntry({ dateTime: new Date(today.getTime() + 3600000) }), // Today
        createMockEntry({ dateTime: yesterday }), // Yesterday
        createMockEntry({ dateTime: new Date(today.getTime() + 7200000) }), // Today
      ];

      const todayEntries = entries.filter(e => {
        const entryDate = new Date(e.dateTime);
        return entryDate >= today;
      });

      expect(todayEntries.length).toBe(2);
    });

    it('should filter entries for last 7 days', () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const entries: LogEntry[] = [
        createMockEntry({ dateTime: today }), // Today
        createMockEntry({ dateTime: weekAgo }), // 7 days ago (included)
        createMockEntry({ dateTime: twoWeeksAgo }), // 14 days ago (excluded)
      ];

      const weekEntries = entries.filter(e => {
        const entryDate = new Date(e.dateTime);
        return entryDate >= weekAgo;
      });

      expect(weekEntries.length).toBe(2);
    });
  });
});

