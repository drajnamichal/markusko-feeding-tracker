export interface LogEntry {
  id: string;
  dateTime: Date;
  poop: boolean;
  pee: boolean;
  breastMilkMl: number;
  breastfed: boolean;
  formulaMl: number;
  vomit: boolean;
  vitaminD: boolean;
  tummyTime: boolean;
  sterilization: boolean;
  bathing: boolean;
  sabSimplex: boolean;
  notes: string;
}

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: Date;
  birthTime: string;
  birthWeightGrams: number;
  birthHeightCm: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Measurement {
  id: string;
  babyProfileId: string;
  measuredAt: Date;
  weightGrams: number;
  heightCm: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepSession {
  id: string;
  babyProfileId: string;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
