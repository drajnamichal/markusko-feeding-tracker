import { createClient } from '@supabase/supabase-js';
import type { LogEntry, BabyProfile } from './types';

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
  vitaminD: dbEntry.vitamin_d,
  tummyTime: dbEntry.tummy_time,
  sterilization: dbEntry.sterilization,
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

