import { describe, it, expect } from 'vitest';
import { 
  logEntryToDB, 
  dbToLogEntry, 
  babyProfileToDB, 
  dbToBabyProfile,
  measurementToDB,
  dbToMeasurement,
  type LogEntryDB,
  type BabyProfileDB,
  type MeasurementDB
} from '../../supabaseClient';
import type { LogEntry, BabyProfile, Measurement } from '../../types';

describe('supabaseClient data conversions', () => {
  describe('LogEntry conversions', () => {
    it('should convert LogEntry to database format', () => {
      const entry: LogEntry = {
        id: 'test-id',
        dateTime: new Date('2025-10-15T10:00:00Z'),
        poop: true,
        pee: false,
        breastMilkMl: 60,
        breastfed: true,
        formulaMl: 0,
        vomit: false,
        vitaminD: true,
        tummyTime: false,
        sterilization: false,
        notes: 'Test note',
      };

      const dbEntry = logEntryToDB(entry);

      expect(dbEntry.id).toBe('test-id');
      expect(dbEntry.poop).toBe(true);
      expect(dbEntry.pee).toBe(false);
      expect(dbEntry.breast_milk_ml).toBe(60);
      expect(dbEntry.breastfed).toBe(true);
      expect(dbEntry.vitamin_d).toBe(true);
      expect(dbEntry.notes).toBe('Test note');
    });

    it('should convert database format to LogEntry', () => {
      const dbEntry: LogEntryDB = {
        id: 'test-id',
        date_time: '2025-10-15T10:00:00Z',
        poop: true,
        pee: false,
        breast_milk_ml: 60,
        breastfed: true,
        formula_ml: 0,
        vomit: false,
        vitamin_d: true,
        tummy_time: false,
        sterilization: false,
        notes: 'Test note',
        created_at: '2025-10-15T10:00:00Z',
        updated_at: '2025-10-15T10:00:00Z',
      };

      const entry = dbToLogEntry(dbEntry);

      expect(entry.id).toBe('test-id');
      expect(entry.poop).toBe(true);
      expect(entry.pee).toBe(false);
      expect(entry.breastMilkMl).toBe(60);
      expect(entry.breastfed).toBe(true);
      expect(entry.vitaminD).toBe(true);
      expect(entry.notes).toBe('Test note');
      expect(entry.dateTime).toBeInstanceOf(Date);
    });

    it('should handle round-trip conversion', () => {
      const originalEntry: LogEntry = {
        id: 'test-id',
        dateTime: new Date('2025-10-15T10:00:00Z'),
        poop: false,
        pee: true,
        breastMilkMl: 30,
        breastfed: false,
        formulaMl: 60,
        vomit: true,
        vitaminD: false,
        tummyTime: true,
        sterilization: false,
        notes: '',
      };

      const dbEntry = logEntryToDB(originalEntry);
      const convertedEntry = dbToLogEntry({
        ...dbEntry,
        created_at: '2025-10-15T10:00:00Z',
        updated_at: '2025-10-15T10:00:00Z',
      });

      expect(convertedEntry.id).toBe(originalEntry.id);
      expect(convertedEntry.poop).toBe(originalEntry.poop);
      expect(convertedEntry.pee).toBe(originalEntry.pee);
      expect(convertedEntry.breastMilkMl).toBe(originalEntry.breastMilkMl);
      expect(convertedEntry.formulaMl).toBe(originalEntry.formulaMl);
      expect(convertedEntry.vitaminD).toBe(originalEntry.vitaminD);
      expect(convertedEntry.tummyTime).toBe(originalEntry.tummyTime);
    });
  });

  describe('BabyProfile conversions', () => {
    it('should convert BabyProfile to database format', () => {
      const profile: BabyProfile = {
        id: 'profile-id',
        name: 'Markus Drajna',
        birthDate: new Date('2025-09-29'),
        birthTime: '07:39:00',
        birthWeightGrams: 3030,
        birthHeightCm: 51.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dbProfile = babyProfileToDB(profile);

      expect(dbProfile.name).toBe('Markus Drajna');
      expect(dbProfile.birth_date).toBe('2025-09-29');
      expect(dbProfile.birth_time).toBe('07:39:00');
      expect(dbProfile.birth_weight_grams).toBe(3030);
      expect(dbProfile.birth_height_cm).toBe(51.0);
    });

    it('should convert database format to BabyProfile', () => {
      const dbProfile: BabyProfileDB = {
        id: 'profile-id',
        name: 'Markus Drajna',
        birth_date: '2025-09-29',
        birth_time: '07:39:00',
        birth_weight_grams: 3030,
        birth_height_cm: 51.0,
        created_at: '2025-10-15T10:00:00Z',
        updated_at: '2025-10-15T10:00:00Z',
      };

      const profile = dbToBabyProfile(dbProfile);

      expect(profile.id).toBe('profile-id');
      expect(profile.name).toBe('Markus Drajna');
      expect(profile.birthDate).toBeInstanceOf(Date);
      expect(profile.birthTime).toBe('07:39:00');
      expect(profile.birthWeightGrams).toBe(3030);
      expect(profile.birthHeightCm).toBe(51.0);
    });
  });

  describe('Measurement conversions', () => {
    it('should convert Measurement to database format', () => {
      const measurement: Measurement = {
        id: 'measurement-id',
        babyProfileId: 'profile-id',
        measuredAt: new Date('2025-10-15T10:00:00Z'),
        weightGrams: 3500,
        heightCm: 52.5,
        notes: 'After feeding',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dbMeasurement = measurementToDB(measurement);

      expect(dbMeasurement.baby_profile_id).toBe('profile-id');
      expect(dbMeasurement.weight_grams).toBe(3500);
      expect(dbMeasurement.height_cm).toBe(52.5);
      expect(dbMeasurement.notes).toBe('After feeding');
    });

    it('should convert database format to Measurement', () => {
      const dbMeasurement: MeasurementDB = {
        id: 'measurement-id',
        baby_profile_id: 'profile-id',
        measured_at: '2025-10-15T10:00:00Z',
        weight_grams: 3500,
        height_cm: 52.5,
        notes: 'After feeding',
        created_at: '2025-10-15T10:00:00Z',
        updated_at: '2025-10-15T10:00:00Z',
      };

      const measurement = dbToMeasurement(dbMeasurement);

      expect(measurement.id).toBe('measurement-id');
      expect(measurement.babyProfileId).toBe('profile-id');
      expect(measurement.weightGrams).toBe(3500);
      expect(measurement.heightCm).toBe(52.5);
      expect(measurement.notes).toBe('After feeding');
      expect(measurement.measuredAt).toBeInstanceOf(Date);
    });

    it('should handle empty notes', () => {
      const measurement: Measurement = {
        id: 'measurement-id',
        babyProfileId: 'profile-id',
        measuredAt: new Date('2025-10-15T10:00:00Z'),
        weightGrams: 3500,
        heightCm: 52.5,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dbMeasurement = measurementToDB(measurement);

      expect(dbMeasurement.notes).toBe('');
    });
  });
});

