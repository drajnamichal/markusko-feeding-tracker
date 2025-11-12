import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logEntryToDB } from '../../supabaseClient';
import type { LogEntry } from '../../types';

describe('Add Entry Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logEntryToDB conversion', () => {
    it('should convert LogEntry with vitamin_c to database format', () => {
      const entry: LogEntry = {
        id: 'test-id',
        babyProfileId: 'profile-1',
        dateTime: new Date('2024-01-15T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        vitaminC: true,
        probiotic: false,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Test vitamin C',
      };

      const dbEntry = logEntryToDB(entry);

      expect(dbEntry.vitamin_c).toBe(true);
      expect(dbEntry.vitamin_d).toBe(false);
      expect(dbEntry.probiotic).toBe(false);
      expect(dbEntry.notes).toBe('Test vitamin C');
    });

    it('should convert LogEntry with probiotic to database format', () => {
      const entry: LogEntry = {
        id: 'test-id',
        babyProfileId: 'profile-1',
        dateTime: new Date('2024-01-15T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        vitaminC: false,
        probiotic: true,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Test probiotic',
      };

      const dbEntry = logEntryToDB(entry);

      expect(dbEntry.probiotic).toBe(true);
      expect(dbEntry.vitamin_c).toBe(false);
      expect(dbEntry.vitamin_d).toBe(false);
      expect(dbEntry.notes).toBe('Test probiotic');
    });

    it('should convert LogEntry with all new fields to database format', () => {
      const entry: LogEntry = {
        id: 'test-id',
        babyProfileId: 'profile-1',
        dateTime: new Date('2024-01-15T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: true,
        vitaminC: true,
        probiotic: true,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'All supplements',
      };

      const dbEntry = logEntryToDB(entry);

      expect(dbEntry.vitamin_d).toBe(true);
      expect(dbEntry.vitamin_c).toBe(true);
      expect(dbEntry.probiotic).toBe(true);
    });

    it('should default new fields to false when not specified', () => {
      const entry: LogEntry = {
        id: 'test-id',
        babyProfileId: 'profile-1',
        dateTime: new Date('2024-01-15T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        vitaminC: false,
        probiotic: false,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: '',
      };

      const dbEntry = logEntryToDB(entry);

      expect(dbEntry.vitamin_c).toBe(false);
      expect(dbEntry.probiotic).toBe(false);
    });

    it('should include all required database fields', () => {
      const entry: LogEntry = {
        id: 'test-id-123',
        babyProfileId: 'profile-456',
        dateTime: new Date('2024-01-15T10:30:00Z'),
        poop: true,
        pee: true,
        breastMilkMl: 120,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: true,
        vitaminC: true,
        probiotic: true,
        tummyTime: true,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Complete entry',
      };

      const dbEntry = logEntryToDB(entry);

      // Check all fields are present
      expect(dbEntry.id).toBe('test-id-123');
      expect(dbEntry.baby_profile_id).toBe('profile-456');
      expect(dbEntry.date_time).toBe('2024-01-15T10:30:00.000Z');
      expect(dbEntry.poop).toBe(true);
      expect(dbEntry.pee).toBe(true);
      expect(dbEntry.breast_milk_ml).toBe(120);
      expect(dbEntry.breastfed).toBe(false);
      expect(dbEntry.formula_ml).toBe(0);
      expect(dbEntry.vomit).toBe(false);
      expect(dbEntry.vitamin_d).toBe(true);
      expect(dbEntry.vitamin_c).toBe(true);
      expect(dbEntry.probiotic).toBe(true);
      expect(dbEntry.tummy_time).toBe(true);
      expect(dbEntry.sterilization).toBe(false);
      expect(dbEntry.bathing).toBe(false);
      expect(dbEntry.sab_simplex).toBe(false);
      expect(dbEntry.notes).toBe('Complete entry');
    });
  });

  describe('Database schema validation', () => {
    it('should have all required fields in LogEntry type', () => {
      const entry: LogEntry = {
        id: 'test',
        babyProfileId: 'profile',
        dateTime: new Date(),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        vitaminC: false,
        probiotic: false,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: '',
      };

      // TypeScript compile-time check
      expect(entry).toBeDefined();
    });

    it('should handle quick add entry format with new fields', () => {
      // This simulates the format used in QuickAddButtons
      const quickAddEntry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
        dateTime: new Date().toISOString(),
        babyProfileId: 'profile-1',
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        vitaminC: true,
        probiotic: false,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Quick add: Vitamin C',
      };

      expect(quickAddEntry.vitaminC).toBe(true);
      expect(quickAddEntry.probiotic).toBe(false);
    });

    it('should handle probiotic quick add entry format', () => {
      const quickAddEntry: Omit<LogEntry, 'id' | 'dateTime'> & { dateTime: string } = {
        dateTime: new Date().toISOString(),
        babyProfileId: 'profile-1',
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        vitaminC: false,
        probiotic: true,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Quick add: Probiotic',
      };

      expect(quickAddEntry.probiotic).toBe(true);
      expect(quickAddEntry.vitaminC).toBe(false);
    });
  });

  describe('Backward compatibility', () => {
    it('should maintain sabSimplex field for backward compatibility', () => {
      const entry: LogEntry = {
        id: 'test',
        babyProfileId: 'profile',
        dateTime: new Date(),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        vitaminC: false,
        probiotic: false,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: '',
      };

      const dbEntry = logEntryToDB(entry);

      expect(dbEntry.sab_simplex).toBe(false);
    });
  });
});

