// Temple Ledger: keep measurement quiet, optional, and conversion-focused without changing the visual language.

type AnalyticsValue = string | number | boolean;

export function trackEvent(name: string, data: Record<string, AnalyticsValue> = {}) {
  if (typeof window === "undefined") return;
  const runtime = window as Window & { umami?: { track?: (eventName: string, eventData?: Record<string, AnalyticsValue>) => void } };
  if (typeof runtime.umami?.track === "function") {
    runtime.umami.track(name, data);
  }
}
