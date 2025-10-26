import { describe, it, expect } from 'vitest';

/**
 * SAB Simplex Reminder Tests
 * 
 * Tests the SAB Simplex reminder logic to ensure:
 * - Widget tracks time from LAST dose (globally, not just today)
 * - No reset at midnight
 * - Notifications trigger at 4+ hours
 * - Widget displays correct information
 */

interface LogEntry {
  id: string;
  dateTime: Date;
  sabSimplex: boolean;
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
  notes: string;
}

/**
 * Calculate hours since last SAB Simplex dose
 */
function calculateHoursSinceLastSabSimplex(
  entries: LogEntry[],
  currentTime: Date
): number | null {
  const sabSimplexEntries = entries
    .filter(e => e.sabSimplex)
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

  if (sabSimplexEntries.length === 0) {
    return null;
  }

  const lastDose = sabSimplexEntries[0];
  const hoursSince = (currentTime.getTime() - lastDose.dateTime.getTime()) / (1000 * 60 * 60);
  
  return hoursSince;
}

/**
 * Calculate SAB Simplex doses today
 */
function calculateSabSimplexTodayCount(
  entries: LogEntry[],
  currentDate: Date
): number {
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const sabSimplexEntries = entries.filter(e => {
    const entryDate = new Date(e.dateTime);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime() && e.sabSimplex;
  });

  return sabSimplexEntries.length;
}

/**
 * Determine widget display state
 */
function getWidgetState(hoursSinceLastDose: number | null): 'initial' | 'tracking' {
  return hoursSinceLastDose === null ? 'initial' : 'tracking';
}

/**
 * Check if notification should be sent
 */
function shouldSendNotification(hoursSinceLastDose: number | null): boolean {
  if (hoursSinceLastDose === null) {
    return false;
  }
  return hoursSinceLastDose >= 4;
}

describe('SAB Simplex Reminder Logic', () => {
  describe('calculateHoursSinceLastSabSimplex', () => {
    it('should return null when no SAB Simplex doses exist', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T12:00:00'),
          sabSimplex: false,
          poop: false,
          pee: false,
          breastMilkMl: 90,
          breastfed: false,
          formulaMl: 0,
          vomit: false,
          vitaminD: false,
          tummyTime: false,
          sterilization: false,
          bathing: false,
          notes: '',
        },
      ];

      const currentTime = new Date('2025-01-23T14:00:00');
      const result = calculateHoursSinceLastSabSimplex(entries, currentTime);

      expect(result).toBeNull();
    });

    it('should calculate hours from last dose within same day', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T10:00:00'),
          sabSimplex: true,
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
          notes: 'SAB Simplex',
        },
      ];

      const currentTime = new Date('2025-01-23T14:00:00');
      const result = calculateHoursSinceLastSabSimplex(entries, currentTime);

      expect(result).toBe(4);
    });

    it('should calculate hours from last dose ACROSS MIDNIGHT (critical test)', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T23:00:00'), // Yesterday 23:00
          sabSimplex: true,
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
          notes: 'SAB Simplex',
        },
      ];

      const currentTime = new Date('2025-01-24T01:00:00'); // Today 01:00
      const result = calculateHoursSinceLastSabSimplex(entries, currentTime);

      // Should be 2 hours (23:00 -> 01:00), NOT null or 0
      expect(result).toBe(2);
      expect(result).not.toBeNull();
    });

    it('should calculate hours from last dose across multiple days', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-22T20:00:00'), // 2 days ago
          sabSimplex: true,
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
          notes: 'SAB Simplex',
        },
      ];

      const currentTime = new Date('2025-01-24T08:00:00');
      const result = calculateHoursSinceLastSabSimplex(entries, currentTime);

      // Should be 36 hours (20:00 Jan 22 -> 08:00 Jan 24)
      expect(result).toBe(36);
    });

    it('should always use the MOST RECENT dose', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T08:00:00'),
          sabSimplex: true,
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
          notes: 'Dose 1',
        },
        {
          id: '2',
          dateTime: new Date('2025-01-23T12:00:00'),
          sabSimplex: true,
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
          notes: 'Dose 2',
        },
      ];

      const currentTime = new Date('2025-01-23T16:00:00');
      const result = calculateHoursSinceLastSabSimplex(entries, currentTime);

      // Should be 4 hours from MOST RECENT (12:00), not 8 hours from first (08:00)
      expect(result).toBe(4);
    });
  });

  describe('calculateSabSimplexTodayCount', () => {
    it('should count only today\'s doses', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T08:00:00'),
          sabSimplex: true,
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
          notes: 'Today dose 1',
        },
        {
          id: '2',
          dateTime: new Date('2025-01-23T12:00:00'),
          sabSimplex: true,
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
          notes: 'Today dose 2',
        },
        {
          id: '3',
          dateTime: new Date('2025-01-22T20:00:00'), // Yesterday
          sabSimplex: true,
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
          notes: 'Yesterday dose',
        },
      ];

      const currentDate = new Date('2025-01-23T14:00:00');
      const result = calculateSabSimplexTodayCount(entries, currentDate);

      // Should only count 2 doses from today, not yesterday's dose
      expect(result).toBe(2);
    });

    it('should return 0 when no doses today (but doses exist from yesterday)', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-22T23:00:00'), // Yesterday
          sabSimplex: true,
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
          notes: 'Yesterday dose',
        },
      ];

      const currentDate = new Date('2025-01-23T01:00:00'); // Today
      const result = calculateSabSimplexTodayCount(entries, currentDate);

      // Should be 0 (no doses today), but hoursSinceLastDose should NOT be null
      expect(result).toBe(0);
    });
  });

  describe('Widget State Logic', () => {
    it('should show "initial" state when no doses ever', () => {
      const hoursSinceLastDose = null;
      const state = getWidgetState(hoursSinceLastDose);

      expect(state).toBe('initial');
    });

    it('should show "tracking" state after first dose', () => {
      const hoursSinceLastDose = 2.5;
      const state = getWidgetState(hoursSinceLastDose);

      expect(state).toBe('tracking');
    });

    it('should show "tracking" state even after midnight with 0 doses today', () => {
      // Last dose was yesterday at 23:00, now it's 01:00 (2 hours ago)
      const hoursSinceLastDose = 2;
      const state = getWidgetState(hoursSinceLastDose);

      // Should be "tracking", NOT "initial"
      expect(state).toBe('tracking');
      expect(state).not.toBe('initial');
    });

    it('should show "tracking" state even 24+ hours after last dose', () => {
      const hoursSinceLastDose = 30; // 30 hours since last dose
      const state = getWidgetState(hoursSinceLastDose);

      expect(state).toBe('tracking');
    });
  });

  describe('Notification Logic', () => {
    it('should NOT send notification when no doses exist', () => {
      const hoursSinceLastDose = null;
      const result = shouldSendNotification(hoursSinceLastDose);

      expect(result).toBe(false);
    });

    it('should NOT send notification before 4 hours', () => {
      const hoursSinceLastDose = 3.5;
      const result = shouldSendNotification(hoursSinceLastDose);

      expect(result).toBe(false);
    });

    it('should send notification at exactly 4 hours', () => {
      const hoursSinceLastDose = 4.0;
      const result = shouldSendNotification(hoursSinceLastDose);

      expect(result).toBe(true);
    });

    it('should send notification after 4 hours', () => {
      const hoursSinceLastDose = 5.5;
      const result = shouldSendNotification(hoursSinceLastDose);

      expect(result).toBe(true);
    });

    it('should send notification even when last dose was yesterday (across midnight)', () => {
      // Last dose: yesterday 23:00, current time: today 03:00 (4 hours later)
      const hoursSinceLastDose = 4;
      const result = shouldSendNotification(hoursSinceLastDose);

      // Should trigger notification, not reset
      expect(result).toBe(true);
    });
  });

  describe('Integration Scenarios', () => {
    it('Scenario 1: First dose ever', () => {
      const entries: LogEntry[] = [];
      const currentTime = new Date('2025-01-23T10:00:00');

      const hoursSince = calculateHoursSinceLastSabSimplex(entries, currentTime);
      const todayCount = calculateSabSimplexTodayCount(entries, currentTime);
      const widgetState = getWidgetState(hoursSince);
      const shouldNotify = shouldSendNotification(hoursSince);

      expect(hoursSince).toBeNull();
      expect(todayCount).toBe(0);
      expect(widgetState).toBe('initial'); // Show "Nezabudni dať SAB Simplex"
      expect(shouldNotify).toBe(false);
    });

    it('Scenario 2: Dose given 2 hours ago (same day)', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T08:00:00'),
          sabSimplex: true,
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
          notes: '',
        },
      ];
      const currentTime = new Date('2025-01-23T10:00:00');

      const hoursSince = calculateHoursSinceLastSabSimplex(entries, currentTime);
      const todayCount = calculateSabSimplexTodayCount(entries, currentTime);
      const widgetState = getWidgetState(hoursSince);
      const shouldNotify = shouldSendNotification(hoursSince);

      expect(hoursSince).toBe(2);
      expect(todayCount).toBe(1);
      expect(widgetState).toBe('tracking'); // Show "Od poslednej dávky: 2.0h"
      expect(shouldNotify).toBe(false); // Too soon
    });

    it('Scenario 3: CRITICAL - Dose given yesterday at 23:00, now 01:00 (2h later, NEW DAY)', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T23:00:00'), // Yesterday
          sabSimplex: true,
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
          notes: 'Last dose',
        },
      ];
      const currentTime = new Date('2025-01-24T01:00:00'); // New day

      const hoursSince = calculateHoursSinceLastSabSimplex(entries, currentTime);
      const todayCount = calculateSabSimplexTodayCount(entries, currentTime);
      const widgetState = getWidgetState(hoursSince);
      const shouldNotify = shouldSendNotification(hoursSince);

      expect(hoursSince).toBe(2); // 2 hours since last dose
      expect(todayCount).toBe(0); // No doses TODAY (new day)
      expect(widgetState).toBe('tracking'); // SHOULD BE "tracking", NOT "initial"
      expect(shouldNotify).toBe(false); // Only 2 hours, need 4+
    });

    it('Scenario 4: Dose given yesterday at 22:00, now 02:00 (4h later, NEW DAY, should notify)', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T22:00:00'), // Yesterday
          sabSimplex: true,
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
          notes: 'Last dose',
        },
      ];
      const currentTime = new Date('2025-01-24T02:00:00'); // New day

      const hoursSince = calculateHoursSinceLastSabSimplex(entries, currentTime);
      const todayCount = calculateSabSimplexTodayCount(entries, currentTime);
      const widgetState = getWidgetState(hoursSince);
      const shouldNotify = shouldSendNotification(hoursSince);

      expect(hoursSince).toBe(4); // 4 hours since last dose
      expect(todayCount).toBe(0); // No doses TODAY
      expect(widgetState).toBe('tracking'); // Show "Od poslednej dávky: 4.0h"
      expect(shouldNotify).toBe(true); // Should send notification!
    });

    it('Scenario 5: Multiple doses today, 3 hours since last', () => {
      const entries: LogEntry[] = [
        {
          id: '1',
          dateTime: new Date('2025-01-23T08:00:00'),
          sabSimplex: true,
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
          notes: 'Dose 1',
        },
        {
          id: '2',
          dateTime: new Date('2025-01-23T12:00:00'),
          sabSimplex: true,
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
          notes: 'Dose 2',
        },
        {
          id: '3',
          dateTime: new Date('2025-01-23T16:00:00'),
          sabSimplex: true,
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
          notes: 'Dose 3',
        },
      ];
      const currentTime = new Date('2025-01-23T19:00:00');

      const hoursSince = calculateHoursSinceLastSabSimplex(entries, currentTime);
      const todayCount = calculateSabSimplexTodayCount(entries, currentTime);
      const widgetState = getWidgetState(hoursSince);
      const shouldNotify = shouldSendNotification(hoursSince);

      expect(hoursSince).toBe(3);
      expect(todayCount).toBe(3);
      expect(widgetState).toBe('tracking');
      expect(shouldNotify).toBe(false); // Need 1 more hour
    });
  });
});

