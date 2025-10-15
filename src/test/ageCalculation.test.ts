import { describe, it, expect, vi } from 'vitest';

describe('Age calculation', () => {
  const calculateAge = (birthDate: Date, currentDate: Date): string => {
    const diffTime = Math.abs(currentDate.getTime() - birthDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'deň' : diffDays < 5 ? 'dni' : 'dní'}`;
    } else {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      
      let monthText = months === 1 ? 'mesiac' : months < 5 ? 'mesiace' : 'mesiacov';
      let dayText = remainingDays === 1 ? 'deň' : remainingDays < 5 ? 'dni' : 'dní';
      
      if (remainingDays === 0) {
        return `${months} ${monthText}`;
      }
      return `${months} ${monthText}, ${remainingDays} ${dayText}`;
    }
  };

  describe('Days only (under 30 days)', () => {
    it('should show 1 deň for 1 day old', () => {
      const birthDate = new Date('2025-10-14');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('1 deň');
    });

    it('should show 2 dni for 2 days old', () => {
      const birthDate = new Date('2025-10-13');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('2 dni');
    });

    it('should show 4 dni for 4 days old', () => {
      const birthDate = new Date('2025-10-11');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('4 dni');
    });

    it('should show 5 dní for 5 days old', () => {
      const birthDate = new Date('2025-10-10');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('5 dní');
    });

    it('should show 16 dní for 16 days old', () => {
      const birthDate = new Date('2025-09-29');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('16 dní');
    });

    it('should show 29 dní for 29 days old', () => {
      const birthDate = new Date('2025-09-16');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('29 dní');
    });
  });

  describe('Months and days (30+ days)', () => {
    it('should show 1 mesiac for exactly 30 days', () => {
      const birthDate = new Date('2025-09-15');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('1 mesiac');
    });

    it('should show 1 mesiac, 1 deň for 31 days', () => {
      const birthDate = new Date('2025-09-14');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('1 mesiac, 1 deň');
    });

    it('should show 1 mesiac, 5 dní for 35 days', () => {
      const birthDate = new Date('2025-09-10');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('1 mesiac, 5 dní');
    });

    it('should show 2 mesiace for exactly 60 days', () => {
      const birthDate = new Date('2025-08-16');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('2 mesiace');
    });

    it('should show 2 mesiace, 3 dni for 63 days', () => {
      const birthDate = new Date('2025-08-13');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('2 mesiace, 3 dni');
    });

    it('should show 5 mesiacov for exactly 150 days', () => {
      const birthDate = new Date('2025-05-18');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('5 mesiacov');
    });

    it('should show 5 mesiacov, 10 dní for 160 days', () => {
      const birthDate = new Date('2025-05-08');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('5 mesiacov, 10 dní');
    });
  });

  describe('Edge cases', () => {
    it('should handle same day (0 days)', () => {
      const birthDate = new Date('2025-10-15');
      const currentDate = new Date('2025-10-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('0 dni'); // 0 is treated as < 5, so "dni" not "dní"
    });

    it('should handle leap year', () => {
      const birthDate = new Date('2024-02-29');
      const currentDate = new Date('2024-03-15');
      
      const age = calculateAge(birthDate, currentDate);
      expect(age).toBe('15 dní');
    });
  });
});

