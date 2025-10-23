// Haptic Feedback Utility
// Provides vibration feedback for mobile devices

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [10, 100, 10, 100],
  error: [50, 100, 50],
};

/**
 * Trigger haptic feedback (vibration) on supported devices
 * @param pattern - The haptic pattern to use
 */
export const haptic = (pattern: HapticPattern = 'light'): void => {
  // Check if vibration API is supported
  if (!('vibrate' in navigator)) {
    return;
  }

  try {
    const vibrationPattern = patterns[pattern];
    navigator.vibrate(vibrationPattern);
  } catch (error) {
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Cancel any ongoing vibration
 */
export const cancelHaptic = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(0);
  }
};

// Convenience functions for common actions
export const hapticLight = () => haptic('light');
export const hapticMedium = () => haptic('medium');
export const hapticHeavy = () => haptic('heavy');
export const hapticSuccess = () => haptic('success');
export const hapticWarning = () => haptic('warning');
export const hapticError = () => haptic('error');

