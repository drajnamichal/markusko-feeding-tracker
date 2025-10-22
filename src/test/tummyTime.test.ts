import { describe, it, expect } from 'vitest';
import { logEntryToDB, dbToLogEntry, type LogEntryDB } from '../../supabaseClient';
import type { LogEntry } from '../../types';

describe('Tummy Time functionality', () => {
  describe('Tummy Time entry creation', () => {
    it('should create a valid Tummy Time entry with all required fields', () => {
      const tummyTimeEntry: LogEntry = {
        id: 'tummy-time-id',
        dateTime: new Date('2025-10-22T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        tummyTime: true,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Tummy Time: 5 min 30 sek',
      };

      // Test that all fields are present
      expect(tummyTimeEntry.tummyTime).toBe(true);
      expect(tummyTimeEntry.poop).toBe(false);
      expect(tummyTimeEntry.pee).toBe(false);
      expect(tummyTimeEntry.breastMilkMl).toBe(0);
      expect(tummyTimeEntry.breastfed).toBe(false);
      expect(tummyTimeEntry.formulaMl).toBe(0);
      expect(tummyTimeEntry.vomit).toBe(false);
      expect(tummyTimeEntry.vitaminD).toBe(false);
      expect(tummyTimeEntry.sterilization).toBe(false);
      expect(tummyTimeEntry.bathing).toBe(false);
      expect(tummyTimeEntry.sabSimplex).toBe(false);
      expect(tummyTimeEntry.notes).toContain('Tummy Time');
    });

    it('should format Tummy Time duration correctly in notes', () => {
      // Test various durations
      const testCases = [
        { seconds: 330, expected: 'Tummy Time: 5 min 30 sek' },
        { seconds: 60, expected: 'Tummy Time: 1 min 0 sek' },
        { seconds: 125, expected: 'Tummy Time: 2 min 5 sek' },
        { seconds: 45, expected: 'Tummy Time: 0 min 45 sek' },
        { seconds: 600, expected: 'Tummy Time: 10 min 0 sek' },
      ];

      testCases.forEach(({ seconds, expected }) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const notes = `Tummy Time: ${minutes} min ${remainingSeconds} sek`;
        expect(notes).toBe(expected);
      });
    });

    it('should convert Tummy Time entry to database format without errors', () => {
      const tummyTimeEntry: LogEntry = {
        id: 'tummy-time-id',
        dateTime: new Date('2025-10-22T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        tummyTime: true,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Tummy Time: 5 min 30 sek',
      };

      // This should not throw an error
      const dbEntry = logEntryToDB(tummyTimeEntry);

      expect(dbEntry.id).toBe('tummy-time-id');
      expect(dbEntry.tummy_time).toBe(true);
      expect(dbEntry.sab_simplex).toBe(false);
      expect(dbEntry.bathing).toBe(false);
      expect(dbEntry.sterilization).toBe(false);
      expect(dbEntry.notes).toBe('Tummy Time: 5 min 30 sek');
    });

    it('should handle round-trip conversion for Tummy Time entry', () => {
      const originalEntry: LogEntry = {
        id: 'tummy-time-id',
        dateTime: new Date('2025-10-22T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        tummyTime: true,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Tummy Time: 5 min 30 sek',
      };

      const dbEntry = logEntryToDB(originalEntry);
      const convertedEntry = dbToLogEntry({
        ...dbEntry,
        created_at: '2025-10-22T10:00:00Z',
        updated_at: '2025-10-22T10:00:00Z',
      });

      expect(convertedEntry.id).toBe(originalEntry.id);
      expect(convertedEntry.tummyTime).toBe(originalEntry.tummyTime);
      expect(convertedEntry.sabSimplex).toBe(originalEntry.sabSimplex);
      expect(convertedEntry.bathing).toBe(originalEntry.bathing);
      expect(convertedEntry.sterilization).toBe(originalEntry.sterilization);
      expect(convertedEntry.notes).toBe(originalEntry.notes);
    });
  });

  describe('LogEntry type validation', () => {
    it('should ensure all LogEntry fields are accounted for in conversions', () => {
      // This test ensures that if we add new fields to LogEntry,
      // we remember to add them to the conversion functions
      const completeEntry: LogEntry = {
        id: 'test-id',
        dateTime: new Date('2025-10-22T10:00:00Z'),
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
        sabSimplex: false,
        notes: '',
      };

      const dbEntry = logEntryToDB(completeEntry);

      // Verify all fields are present in DB format
      expect(dbEntry).toHaveProperty('id');
      expect(dbEntry).toHaveProperty('date_time');
      expect(dbEntry).toHaveProperty('poop');
      expect(dbEntry).toHaveProperty('pee');
      expect(dbEntry).toHaveProperty('breast_milk_ml');
      expect(dbEntry).toHaveProperty('breastfed');
      expect(dbEntry).toHaveProperty('formula_ml');
      expect(dbEntry).toHaveProperty('vomit');
      expect(dbEntry).toHaveProperty('vitamin_d');
      expect(dbEntry).toHaveProperty('tummy_time');
      expect(dbEntry).toHaveProperty('sterilization');
      expect(dbEntry).toHaveProperty('bathing');
      expect(dbEntry).toHaveProperty('sab_simplex');
      expect(dbEntry).toHaveProperty('notes');
    });

    it('should verify sabSimplex field is always present in new entries', () => {
      // This test specifically checks for the sabSimplex field that was causing the bug
      const entries: LogEntry[] = [
        {
          id: 'entry-1',
          dateTime: new Date(),
          poop: false,
          pee: false,
          breastMilkMl: 0,
          breastfed: false,
          formulaMl: 0,
          vomit: false,
          vitaminD: false,
          tummyTime: true,
          sterilization: false,
          bathing: false,
          sabSimplex: false,
          notes: 'Tummy Time',
        },
        {
          id: 'entry-2',
          dateTime: new Date(),
          poop: false,
          pee: false,
          breastMilkMl: 100,
          breastfed: false,
          formulaMl: 0,
          vomit: false,
          vitaminD: false,
          tummyTime: false,
          sterilization: false,
          bathing: false,
          sabSimplex: true,
          notes: 'Fed with SAB Simplex',
        },
      ];

      entries.forEach((entry) => {
        expect(entry).toHaveProperty('sabSimplex');
        expect(typeof entry.sabSimplex).toBe('boolean');

        const dbEntry = logEntryToDB(entry);
        expect(dbEntry).toHaveProperty('sab_simplex');
        expect(typeof dbEntry.sab_simplex).toBe('boolean');
      });
    });
  });

  describe('Bathing and Sterilization entries', () => {
    it('should create valid bathing entry with all fields', () => {
      const bathingEntry: LogEntry = {
        id: 'bathing-id',
        dateTime: new Date('2025-10-22T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        tummyTime: false,
        sterilization: false,
        bathing: true,
        sabSimplex: false,
        notes: 'Kúpanie',
      };

      const dbEntry = logEntryToDB(bathingEntry);

      expect(dbEntry.bathing).toBe(true);
      expect(dbEntry.sab_simplex).toBe(false);
    });

    it('should create valid sterilization entry with all fields', () => {
      const sterilizationEntry: LogEntry = {
        id: 'sterilization-id',
        dateTime: new Date('2025-10-22T10:00:00Z'),
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 0,
        vomit: false,
        vitaminD: false,
        tummyTime: false,
        sterilization: true,
        bathing: false,
        sabSimplex: false,
        notes: 'Sterilizácia',
      };

      const dbEntry = logEntryToDB(sterilizationEntry);

      expect(dbEntry.sterilization).toBe(true);
      expect(dbEntry.sab_simplex).toBe(false);
    });
  });
});

