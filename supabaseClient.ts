import { createClient } from '@supabase/supabase-js';
import type { LogEntry } from './types';

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
  notes: dbEntry.notes,
});

