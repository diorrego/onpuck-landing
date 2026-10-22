// Funnel events (PLAN 7.1), pushed to GTM's dataLayer and mirrored to Microsoft Clarity.
export const EVENTS = [
  'cta_click',
  'scroll_section',
  'paper_link_click',
  'experiment_expand',
  'form_start',
  'form_submit_success',
  'calendar_booked',
  'faq_open',
] as const;

export type EventName = (typeof EVENTS)[number];

type Win = Window & { dataLayer?: Record<string, unknown>[]; clarity?: (...args: unknown[]) => void };

export function track(event: EventName, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === 'undefined' || !EVENTS.includes(event)) return;
  const w = window as Win;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
  w.clarity?.('event', event);
}
