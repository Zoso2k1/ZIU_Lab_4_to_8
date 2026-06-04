import { useCallback } from 'react';

export function useTracking() {
  const trackEvent = useCallback((eventName: string, eventData: Record<string, any> = {}) => {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...eventData,
    };

    // W prawdziwym projekcie tutaj byłby fetch() do Twojego API lub Google Analytics
    console.log('[Analytics Event]:', payload);
  }, []);

  return { trackEvent };
}