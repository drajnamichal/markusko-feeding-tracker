import { createClient } from '@supabase/supabase-js';
import type { LogEntry, BabyProfile, Measurement, SleepSession } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface LogEntryDB {
  id: string;
  date_time: string;
  poop: boolean;
  pee: boolean;
  breast_milk_ml: number;
  breastfed: boolean;
  formula_ml: number;
  vomit: boolean;
  vitamin_d: boolean;
  tummy_time: boolean;
  sterilization: boolean;
  bathing: boolean;
  sab_simplex: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Convert LogEntry to database format
export const logEntryToDB = (entry: LogEntry): Omit<LogEntryDB, 'created_at' | 'updated_at'> => ({
  id: entry.id,
  date_time: entry.dateTime.toISOString(),
  poop: entry.poop,
  pee: entry.pee,
  breast_milk_ml: entry.breastMilkMl,
  breastfed: entry.breastfed,
  formula_ml: entry.formulaMl,
  vomit: entry.vomit,
  vitamin_d: entry.vitaminD,
  tummy_time: entry.tummyTime,
  sterilization: entry.sterilization,
  bathing: entry.bathing,
  sab_simplex: entry.sabSimplex,
  notes: entry.notes,
});

// Convert database format to LogEntry
export const dbToLogEntry = (dbEntry: LogEntryDB): LogEntry => ({
  id: dbEntry.id,
  dateTime: new Date(dbEntry.date_time),
  poop: dbEntry.poop,
  pee: dbEntry.pee,
  breastMilkMl: dbEntry.breast_milk_ml,
  breastfed: dbEntry.breastfed,
  formulaMl: dbEntry.formula_ml,
  vomit: dbEntry.vomit,
  vitaminD: dbEntry.vitamin_d ?? false,
  tummyTime: dbEntry.tummy_time ?? false,
  sterilization: dbEntry.sterilization ?? false,
  bathing: dbEntry.bathing ?? false,
  sabSimplex: dbEntry.sab_simplex ?? false,
  notes: dbEntry.notes,
});

// Database types for BabyProfile
export interface BabyProfileDB {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_weight_grams: number;
  birth_height_cm: number;
  created_at: string;
  updated_at: string;
}

// Convert BabyProfile to database format
export const babyProfileToDB = (profile: BabyProfile): Omit<BabyProfileDB, 'id' | 'created_at' | 'updated_at'> => ({
  name: profile.name,
  birth_date: profile.birthDate.toISOString().split('T')[0], // YYYY-MM-DD format
  birth_time: profile.birthTime,
  birth_weight_grams: profile.birthWeightGrams,
  birth_height_cm: profile.birthHeightCm,
});

// Convert database format to BabyProfile
export const dbToBabyProfile = (dbProfile: BabyProfileDB): BabyProfile => ({
  id: dbProfile.id,
  name: dbProfile.name,
  birthDate: new Date(dbProfile.birth_date),
  birthTime: dbProfile.birth_time,
  birthWeightGrams: dbProfile.birth_weight_grams,
  birthHeightCm: dbProfile.birth_height_cm,
  createdAt: new Date(dbProfile.created_at),
  updatedAt: new Date(dbProfile.updated_at),
});

// Database types for Measurement
export interface MeasurementDB {
  id: string;
  baby_profile_id: string;
  measured_at: string;
  weight_grams: number;
  height_cm: number;
  head_circumference_cm: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Convert Measurement to database format
export const measurementToDB = (measurement: Measurement): Omit<MeasurementDB, 'id' | 'created_at' | 'updated_at'> => ({
  baby_profile_id: measurement.babyProfileId,
  measured_at: measurement.measuredAt.toISOString(),
  weight_grams: measurement.weightGrams,
  height_cm: measurement.heightCm,
  head_circumference_cm: measurement.headCircumferenceCm,
  notes: measurement.notes || '',
});

// Convert database format to Measurement
export const dbToMeasurement = (dbMeasurement: MeasurementDB): Measurement => ({
  id: dbMeasurement.id,
  babyProfileId: dbMeasurement.baby_profile_id,
  measuredAt: new Date(dbMeasurement.measured_at),
  weightGrams: dbMeasurement.weight_grams,
  heightCm: dbMeasurement.height_cm,
  headCircumferenceCm: dbMeasurement.head_circumference_cm || 0,
  notes: dbMeasurement.notes,
  createdAt: new Date(dbMeasurement.created_at),
  updatedAt: new Date(dbMeasurement.updated_at),
});

// Database types for SleepSession
export interface SleepSessionDB {
  id: string;
  baby_profile_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Convert SleepSession to database format
export const sleepSessionToDB = (session: SleepSession): Omit<SleepSessionDB, 'created_at' | 'updated_at'> => ({
  id: session.id,
  baby_profile_id: session.babyProfileId,
  start_time: session.startTime.toISOString(),
  end_time: session.endTime ? session.endTime.toISOString() : null,
  duration_minutes: session.durationMinutes,
  notes: session.notes || '',
});

// Convert database format to SleepSession
export const dbToSleepSession = (dbSession: SleepSessionDB): SleepSession => ({
  id: dbSession.id,
  babyProfileId: dbSession.baby_profile_id,
  startTime: new Date(dbSession.start_time),
  endTime: dbSession.end_time ? new Date(dbSession.end_time) : null,
  durationMinutes: dbSession.duration_minutes,
  notes: dbSession.notes,
  createdAt: new Date(dbSession.created_at),
  updatedAt: new Date(dbSession.updated_at),
});

