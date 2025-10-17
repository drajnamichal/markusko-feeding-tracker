import { describe, it, expect } from 'vitest';
import type { LogEntry } from '../../types';

describe('Reminders Logic', () => {
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

  describe('Vitamin D reminder', () => {
    it('should show reminder when no vitamin D today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const entries: LogEntry[] = [
        createMockEntry({ 
          vitaminD: false,
          dateTime: new Date()
        }),
      ];

      const hasVitaminDToday = entries.some(entry => {
        const entryDate = new Date(entry.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && entry.vitaminD;
      });

      expect(hasVitaminDToday).toBe(false);
    });

    it('should not show reminder when vitamin D given today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const entries: LogEntry[] = [
        createMockEntry({ 
          vitaminD: true,
          dateTime: new Date()
        }),
      ];

      const hasVitaminDToday = entries.some(entry => {
        const entryDate = new Date(entry.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && entry.vitaminD;
      });

      expect(hasVitaminDToday).toBe(true);
    });
  });

  describe('Tummy Time reminder', () => {
    it('should show reminder when less than 3 tummy times today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const entries: LogEntry[] = [
        createMockEntry({ 
          tummyTime: true,
          dateTime: new Date()
        }),
        createMockEntry({ 
          tummyTime: true,
          dateTime: new Date()
        }),
      ];

      const tummyTimeToday = entries.filter(entry => {
        const entryDate = new Date(entry.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && entry.tummyTime;
      }).length;

      const showReminder = tummyTimeToday < 3;

      expect(tummyTimeToday).toBe(2);
      expect(showReminder).toBe(true);
    });

    it('should not show reminder when 3 or more tummy times today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const entries: LogEntry[] = [
        createMockEntry({ tummyTime: true, dateTime: new Date() }),
        createMockEntry({ tummyTime: true, dateTime: new Date() }),
        createMockEntry({ tummyTime: true, dateTime: new Date() }),
      ];

      const tummyTimeToday = entries.filter(entry => {
        const entryDate = new Date(entry.dateTime);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime() && entry.tummyTime;
      }).length;

      const showReminder = tummyTimeToday < 3;

      expect(tummyTimeToday).toBe(3);
      expect(showReminder).toBe(false);
    });
  });

  describe('Sterilization reminder', () => {
    it('should show reminder when 2 days since last sterilization', () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const entries: LogEntry[] = [
        createMockEntry({ 
          sterilization: true,
          dateTime: twoDaysAgo
        }),
      ];

      const sterilizationEntries = entries
        .filter(entry => entry.sterilization)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (sterilizationEntries.length > 0) {
        const lastSterilization = sterilizationEntries[0].dateTime;
        const lastSterilizationDay = new Date(
          lastSterilization.getFullYear(),
          lastSterilization.getMonth(),
          lastSterilization.getDate()
        );
        const diffTime = today.getTime() - lastSterilizationDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        expect(diffDays).toBe(2);
        expect(diffDays >= 2).toBe(true);
      }
    });

    it('should not show reminder when sterilized yesterday', () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const entries: LogEntry[] = [
        createMockEntry({ 
          sterilization: true,
          dateTime: yesterday
        }),
      ];

      const sterilizationEntries = entries
        .filter(entry => entry.sterilization)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (sterilizationEntries.length > 0) {
        const lastSterilization = sterilizationEntries[0].dateTime;
        const lastSterilizationDay = new Date(
          lastSterilization.getFullYear(),
          lastSterilization.getMonth(),
          lastSterilization.getDate()
        );
        const diffTime = today.getTime() - lastSterilizationDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        expect(diffDays).toBe(1);
        expect(diffDays >= 2).toBe(false);
      }
    });

    it('should show reminder when no sterilization recorded', () => {
      const entries: LogEntry[] = [];

      const sterilizationEntries = entries
        .filter(entry => entry.sterilization);

      const showReminder = sterilizationEntries.length === 0;
      
      expect(showReminder).toBe(true);
    });
  });

  describe('Bathing reminder', () => {
    it('should show reminder when 2 days since last bathing', () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const entries: LogEntry[] = [
        createMockEntry({ 
          bathing: true,
          dateTime: twoDaysAgo
        }),
      ];

      const bathingEntries = entries
        .filter(entry => entry.bathing)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (bathingEntries.length > 0) {
        const lastBathing = bathingEntries[0].dateTime;
        const lastBathingDay = new Date(
          lastBathing.getFullYear(),
          lastBathing.getMonth(),
          lastBathing.getDate()
        );
        const diffTime = today.getTime() - lastBathingDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        expect(diffDays).toBe(2);
        expect(diffDays >= 2).toBe(true);
      }
    });

    it('should not show reminder when bathed today', () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const entries: LogEntry[] = [
        createMockEntry({ 
          bathing: true,
          dateTime: today
        }),
      ];

      const bathingEntries = entries
        .filter(entry => entry.bathing)
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      if (bathingEntries.length > 0) {
        const lastBathing = bathingEntries[0].dateTime;
        const lastBathingDay = new Date(
          lastBathing.getFullYear(),
          lastBathing.getMonth(),
          lastBathing.getDate()
        );
        const diffTime = today.getTime() - lastBathingDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        expect(diffDays).toBe(0);
        expect(diffDays >= 2).toBe(false);
      }
    });
  });
});

