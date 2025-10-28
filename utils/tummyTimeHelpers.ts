/**
 * WHO Tummy Time Recommendations Helper
 * 
 * Based on WHO guidelines for infant development
 */

export interface TummyTimeRecommendation {
  ageWeeks: number;
  ageLabel: string;
  recommendedDailyMinutes: number;
  sessionMinutes: string;
  sessionsPerDay: string;
  description: string;
}

/**
 * Get WHO recommended tummy time based on baby's age in weeks
 */
export const getWHOTummyTimeRecommendation = (ageInWeeks: number): TummyTimeRecommendation => {
  if (ageInWeeks <= 2) {
    // 0-2 weeks
    return {
      ageWeeks: ageInWeeks,
      ageLabel: '0-2 týždne',
      recommendedDailyMinutes: 7.5, // 5-10 minutes average
      sessionMinutes: '1-2 minúty',
      sessionsPerDay: 'niekoľkokrát denne',
      description: 'Krátke intervaly niekoľkokrát za deň',
    };
  } else if (ageInWeeks <= 4) {
    // 3-4 weeks
    return {
      ageWeeks: ageInWeeks,
      ageLabel: '3-4 týždne',
      recommendedDailyMinutes: 12.5, // 10-15 minutes average
      sessionMinutes: '2-3 minúty',
      sessionsPerDay: '3-4 krát denne',
      description: '3-4 krát denne po kŕmení',
    };
  } else if (ageInWeeks <= 8) {
    // 1-2 months (5-8 weeks)
    return {
      ageWeeks: ageInWeeks,
      ageLabel: '1-2 mesiace',
      recommendedDailyMinutes: 25, // 20-30 minutes average
      sessionMinutes: '3-5 minút',
      sessionsPerDay: 'viac krát denne',
      description: 'Rozdelené na viac krát',
    };
  } else if (ageInWeeks <= 12) {
    // 2-3 months (9-12 weeks)
    return {
      ageWeeks: ageInWeeks,
      ageLabel: '2-3 mesiace',
      recommendedDailyMinutes: 50, // 40-60 minutes average
      sessionMinutes: '5-10 minút',
      sessionsPerDay: '4-6 krát denne',
      description: 'Napr. 4-6 krát denne',
    };
  } else {
    // 3+ months
    return {
      ageWeeks: ageInWeeks,
      ageLabel: '3+ mesiace',
      recommendedDailyMinutes: 60, // 60+ minutes
      sessionMinutes: '10-15 minút',
      sessionsPerDay: '4-6 krát denne',
      description: 'Postupne zvyšovať',
    };
  }
};

/**
 * Calculate baby's age in weeks from birth date
 */
export const calculateAgeInWeeks = (birthDate: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

/**
 * Format seconds to "X min Y sek" format
 */
export const formatTummyTimeSeconds = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins === 0) {
    return `${secs} sek`;
  } else if (secs === 0) {
    return `${mins} min`;
  } else {
    return `${mins} min ${secs} sek`;
  }
};

/**
 * Calculate progress percentage
 */
export const calculateTummyTimeProgress = (currentMinutes: number, targetMinutes: number): number => {
  if (targetMinutes === 0) return 0;
  const percentage = (currentMinutes / targetMinutes) * 100;
  return Math.min(percentage, 100); // Cap at 100%
};

/**
 * Get progress color based on percentage
 */
export const getTummyTimeProgressColor = (percentage: number): string => {
  if (percentage >= 100) return 'bg-green-500'; // Completed
  if (percentage >= 75) return 'bg-lime-500'; // Almost there
  if (percentage >= 50) return 'bg-yellow-500'; // Halfway
  if (percentage >= 25) return 'bg-orange-500'; // Getting started
  return 'bg-red-500'; // Just started
};

/**
 * Get motivational message based on progress
 */
export const getTummyTimeMessage = (percentage: number): string => {
  if (percentage >= 100) return '🎉 Skvelá práca! Denný cieľ splnený!';
  if (percentage >= 75) return '💪 Takmer tam! Ešte kúsok!';
  if (percentage >= 50) return '👍 Dobrý progres! Pokračuj!';
  if (percentage >= 25) return '🌟 Dobrý začiatok!';
  return '🚀 Začni s Tummy Time!';
};

