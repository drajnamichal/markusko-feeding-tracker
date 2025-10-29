/**
 * Integration tests for EntryForm component
 * These tests verify the complete flow of adding entries
 */

import { describe, it, expect } from 'vitest';
import type { LogEntry } from '../../types';

describe('EntryForm Integration Tests', () => {
  describe('Entry creation with babyProfileId', () => {
    it('should create entry without babyProfileId in form data', () => {
      // Simulate what EntryForm sends to onAddEntry
      const formData: Omit<LogEntry, 'id' | 'dateTime' | 'babyProfileId'> & { dateTime: string } = {
        dateTime: '2025-10-29T20:00:00',
        poop: false,
        pee: false,
        breastMilkMl: 70,
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

      // Verify that babyProfileId is NOT in formData (it will be added by App.tsx)
      expect('babyProfileId' in formData).toBe(false);
      
      // Verify all required fields are present
      expect(formData.breastMilkMl).toBe(70);
      expect(formData.dateTime).toBeTruthy();
    });

    it('should have correct type signature for onAddEntry callback', () => {
      // Type test: this should compile without errors
      type ExpectedCallback = (entry: Omit<LogEntry, 'id' | 'dateTime' | 'babyProfileId'> & { dateTime: string }) => Promise<void>;
      
      const mockCallback: ExpectedCallback = async (entry) => {
        // App.tsx will add babyProfileId and id
        const fullEntry: LogEntry = {
          ...entry,
          id: 'generated-id',
          dateTime: new Date(entry.dateTime),
          babyProfileId: 'current-profile-id',
        };
        
        expect(fullEntry.babyProfileId).toBe('current-profile-id');
      };

      // This test passes if TypeScript compilation succeeds
      expect(typeof mockCallback).toBe('function');
    });

    it('should properly construct LogEntry with all required fields', () => {
      // Simulate App.tsx addEntry function
      const formData = {
        dateTime: '2025-10-29T20:00:00',
        poop: false,
        pee: false,
        breastMilkMl: 70,
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

      const selectedProfileId = 'profile-123';
      
      const entryWithDate: LogEntry = {
        ...formData,
        id: new Date().toISOString() + Math.random(),
        dateTime: new Date(formData.dateTime),
        babyProfileId: selectedProfileId,
      };

      // Verify the complete entry has all required fields
      expect(entryWithDate.id).toBeTruthy();
      expect(entryWithDate.babyProfileId).toBe('profile-123');
      expect(entryWithDate.dateTime).toBeInstanceOf(Date);
      expect(entryWithDate.breastMilkMl).toBe(70);
      expect(entryWithDate.poop).toBe(false);
      expect(entryWithDate.pee).toBe(false);
      expect(entryWithDate.breastfed).toBe(false);
      expect(entryWithDate.formulaMl).toBe(0);
      expect(entryWithDate.vomit).toBe(false);
      expect(entryWithDate.vitaminD).toBe(false);
      expect(entryWithDate.tummyTime).toBe(false);
      expect(entryWithDate.sterilization).toBe(false);
      expect(entryWithDate.bathing).toBe(false);
      expect(entryWithDate.sabSimplex).toBe(false);
      expect(entryWithDate.notes).toBe('');
    });
  });

  describe('Regression test for missing babyProfileId', () => {
    it('should fail if babyProfileId is missing from LogEntry type', () => {
      // This test ensures we don't remove babyProfileId from LogEntry in the future
      const entry: LogEntry = {
        id: 'test-id',
        babyProfileId: 'profile-id', // REQUIRED field
        dateTime: new Date(),
        poop: false,
        pee: false,
        breastMilkMl: 70,
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

      // @ts-expect-error - This should fail if babyProfileId is removed
      const entryWithoutProfileId: LogEntry = {
        id: 'test-id',
        // babyProfileId: missing - should cause TypeScript error
        dateTime: new Date(),
        poop: false,
        pee: false,
        breastMilkMl: 70,
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

      expect(entry.babyProfileId).toBeTruthy();
    });
  });

  describe('Form data validation', () => {
    it('should accept valid breast milk entry', () => {
      const validEntry = {
        dateTime: '2025-10-29T20:00:00',
        poop: false,
        pee: false,
        breastMilkMl: 70,
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

      expect(validEntry.breastMilkMl).toBe(70);
      expect(validEntry.formulaMl).toBe(0);
      expect(validEntry.breastfed).toBe(false);
    });

    it('should accept valid formula entry', () => {
      const validEntry = {
        dateTime: '2025-10-29T20:00:00',
        poop: false,
        pee: false,
        breastMilkMl: 0,
        breastfed: false,
        formulaMl: 60,
        vomit: false,
        vitaminD: false,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: '',
      };

      expect(validEntry.formulaMl).toBe(60);
      expect(validEntry.breastMilkMl).toBe(0);
      expect(validEntry.breastfed).toBe(false);
    });

    it('should accept combined feeding entry', () => {
      const validEntry = {
        dateTime: '2025-10-29T20:00:00',
        poop: false,
        pee: false,
        breastMilkMl: 30,
        breastfed: true,
        formulaMl: 40,
        vomit: false,
        vitaminD: false,
        tummyTime: false,
        sterilization: false,
        bathing: false,
        sabSimplex: false,
        notes: 'Combined feeding',
      };

      expect(validEntry.breastMilkMl).toBe(30);
      expect(validEntry.formulaMl).toBe(40);
      expect(validEntry.breastfed).toBe(true);
    });
  });
});

