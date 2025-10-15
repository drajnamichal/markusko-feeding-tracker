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
