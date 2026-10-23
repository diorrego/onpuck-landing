'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

type Props = { calLink: string; email: string; onBooked?: () => void };

const NS = 'intro';

/** Cal.com's inline embed (@calcom/embed-react): month view, page colours, email prefilled. */
export default function CalBooker({ calLink, email, onBooked }: Props) {
  useEffect(() => {
    let cancelled = false;
    // the namespace outlives this component: remove the listener, or the next booker reports twice
    const callback = () => onBooked?.();
    const api = getCalApi({ namespace: NS });
    (async () => {
      const cal = await api;
      if (cancelled) return;
      cal('ui', { theme: 'light', layout: 'month_view', hideEventTypeDetails: false, cssVarsPerTheme: { light: { 'cal-brand': '#1d4ed8' }, dark: { 'cal-brand': '#1d4ed8' } } });
      cal('on', { action: 'bookingSuccessful', callback });
    })();
    return () => {
      cancelled = true;
      void api.then((cal) => cal('off', { action: 'bookingSuccessful', callback }));
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
