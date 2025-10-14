
import type { LogEntry } from './types';

export const INITIAL_ENTRIES: LogEntry[] = [
  // 8.10.2025
  { id: '1', dateTime: new Date('2025-10-08T01:00:00'), poop: true, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '2', dateTime: new Date('2025-10-08T02:00:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '3', dateTime: new Date('2025-10-08T06:30:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 50, vomit: false, vitaminD: false, notes: '' },
  { id: '4', dateTime: new Date('2025-10-08T11:00:00'), poop: false, pee: true, breastMilkMl: 30, breastfed: false, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '5', dateTime: new Date('2025-10-08T12:50:00'), poop: true, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '6', dateTime: new Date('2025-10-08T13:10:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: true, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '7', dateTime: new Date('2025-10-08T13:20:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: false, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '8', dateTime: new Date('2025-10-08T15:10:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '9', dateTime: new Date('2025-10-08T16:30:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: false, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '10', dateTime: new Date('2025-10-08T17:50:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },

  // 9.10.2025
  { id: '11', dateTime: new Date('2025-10-09T00:30:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '12', dateTime: new Date('2025-10-09T04:00:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '13', dateTime: new Date('2025-10-09T06:00:00'), poop: true, pee: true, breastMilkMl: 20, breastfed: true, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '14', dateTime: new Date('2025-10-09T07:15:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '15', dateTime: new Date('2025-10-09T10:30:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '16', dateTime: new Date('2025-10-09T11:00:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '17', dateTime: new Date('2025-10-09T14:15:00'), poop: true, pee: true, breastMilkMl: 20, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '18', dateTime: new Date('2025-10-09T18:00:00'), poop: true, pee: true, breastMilkMl: 20, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '19', dateTime: new Date('2025-10-09T22:00:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },

  // 10.10.2025
  { id: '20', dateTime: new Date('2025-10-10T02:00:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '21', dateTime: new Date('2025-10-10T06:00:00'), poop: false, pee: true, breastMilkMl: 30, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '22', dateTime: new Date('2025-10-10T10:00:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '23', dateTime: new Date('2025-10-10T15:00:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '24', dateTime: new Date('2025-10-10T19:00:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },

  // 11.10.2025
  { id: '25', dateTime: new Date('2025-10-10T23:00:00'), poop: true, pee: true, breastMilkMl: 20, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '26', dateTime: new Date('2025-10-11T02:30:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '27', dateTime: new Date('2025-10-11T06:00:00'), poop: true, pee: true, breastMilkMl: 20, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '7:00 ZVRACANIE viackrát v priebehu hodiny' },
  { id: '28', dateTime: new Date('2025-10-11T11:30:00'), poop: true, pee: true, breastMilkMl: 30, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '29', dateTime: new Date('2025-10-11T16:00:00'), poop: false, pee: false, breastMilkMl: 30, breastfed: false, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '30', dateTime: new Date('2025-10-11T21:00:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: true, vitaminD: false, notes: '22:00 ZVRACANIE 1x' },

  // 12.10.2025
  { id: '31', dateTime: new Date('2025-10-12T00:00:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: 'ANO 2x' },
  { id: '32', dateTime: new Date('2025-10-12T03:30:00'), poop: false, pee: false, breastMilkMl: 20, breastfed: true, formulaMl: 30, vomit: true, vitaminD: false, notes: '4:10 ZVRACANIE 1x' },
  { id: '33', dateTime: new Date('2025-10-12T07:20:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '34', dateTime: new Date('2025-10-12T09:20:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '35', dateTime: new Date('2025-10-12T12:45:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '36', dateTime: new Date('2025-10-12T15:30:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '37', dateTime: new Date('2025-10-12T19:15:00'), poop: false, pee: true, breastMilkMl: 20, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '38', dateTime: new Date('2025-10-12T23:00:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },

  // 13.10.2025
  { id: '39', dateTime: new Date('2025-10-13T03:00:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 55, vomit: false, vitaminD: false, notes: '' },
  { id: '40', dateTime: new Date('2025-10-13T06:30:00'), poop: false, pee: false, breastMilkMl: 37, breastfed: true, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '41', dateTime: new Date('2025-10-13T07:30:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 30, vomit: false, vitaminD: false, notes: '' },
  { id: '42', dateTime: new Date('2025-10-13T11:30:00'), poop: true, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '43', dateTime: new Date('2025-10-13T15:30:00'), poop: true, pee: false, breastMilkMl: 40, breastfed: true, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '44', dateTime: new Date('2025-10-13T20:30:00'), poop: false, pee: true, breastMilkMl: 20, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },

  // 14.10.2025
  { id: '45', dateTime: new Date('2025-10-14T00:20:00'), poop: true, pee: true, breastMilkMl: 20, breastfed: true, formulaMl: 50, vomit: false, vitaminD: false, notes: '' },
  { id: '46', dateTime: new Date('2025-10-14T04:30:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '47', dateTime: new Date('2025-10-14T08:00:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
  { id: '48', dateTime: new Date('2025-10-14T10:40:00'), poop: true, pee: true, breastMilkMl: 30, breastfed: true, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '49', dateTime: new Date('2025-10-14T11:30:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 0, vomit: false, vitaminD: false, notes: '' },
  { id: '50', dateTime: new Date('2025-10-14T14:30:00'), poop: false, pee: false, breastMilkMl: 0, breastfed: false, formulaMl: 35, vomit: false, vitaminD: false, notes: 'ANO-vyzvracal' },
  { id: '51', dateTime: new Date('2025-10-14T18:00:00'), poop: false, pee: true, breastMilkMl: 0, breastfed: true, formulaMl: 60, vomit: false, vitaminD: false, notes: '' },
];
