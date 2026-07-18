/**
 * Mobile-mimicking Haptic Feedback simulator and real browser Vibration API dispatcher.
 * Integrates directly with native Web API `navigator.vibrate` when supported,
 * and broadcasts a custom Event for an overlay indicator.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function triggerHaptic(type: HapticType = 'light') {
  // 1. Real Device Vibration API
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      switch (type) {
        case 'light':
          window.navigator.vibrate(12);
          break;
        case 'medium':
          window.navigator.vibrate(25);
          break;
        case 'heavy':
          window.navigator.vibrate(45);
          break;
        case 'success':
          window.navigator.vibrate([15, 30, 25]);
          break;
        case 'warning':
          window.navigator.vibrate([30, 40, 30]);
          break;
        case 'error':
          window.navigator.vibrate([50, 25, 50, 25, 100]);
          break;
      }
    } catch (e) {
      // Ignored if blocked by browser policies
    }
  }

  // 2. Broadcast Custom Event to show elegant virtual debug toast
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('app-haptic-trigger', {
      detail: { type, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }
}
