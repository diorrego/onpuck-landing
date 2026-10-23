'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

type Props = { calLink: string; email: string; onBooked?: () => void };

const NS = 'intro';

/** Cal.com's inline embed (@calcom/embed-react): month view, page colours, email prefilled. */
export default function CalBooker({ calLink, email, onBooked }: Props) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: NS });
      if (cancelled) return;
      cal('ui', { theme: 'light', layout: 'month_view', hideEventTypeDetails: false, cssVarsPerTheme: { light: { 'cal-brand': '#1d4ed8' }, dark: { 'cal-brand': '#1d4ed8' } } });
      cal('on', { action: 'bookingSuccessful', callback: () => onBooked?.() });
    })();
    return () => {
      cancelled = true;
    };
  }, [onBooked]);

  return (
    <Cal
      namespace={NS}
      calLink={calLink}
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{ layout: 'month_view', theme: 'light', ...(email ? { email } : {}) }}
    />
  );
}
