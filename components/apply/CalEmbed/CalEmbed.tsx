'use client';

import { useEffect, useRef } from 'react';
import { apply, CONTACT_EMAIL } from '@/content/paper';
import { track } from '@/lib/analytics';

type CalFn = ((...args: unknown[]) => void) & { ns?: Record<string, (...args: unknown[]) => void>; loaded?: boolean; q?: unknown[] };
type CalWindow = Window & { Cal?: CalFn };

const NS = 'intro';
const ORIGIN = 'https://app.cal.com';

// Cal.com's documented embed bootstrap, typed.
function ensureCal(w: CalWindow): CalFn {
  if (w.Cal) return w.Cal;
  const push = (fn: CalFn, args: unknown) => (fn.q = fn.q ?? []).push(args);
  const cal: CalFn = Object.assign(
    function (...args: unknown[]) {
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q ?? [];
        const s = document.createElement('script');
        s.src = `${ORIGIN}/embed/embed.js`;
        s.async = true;
        document.head.appendChild(s);
        cal.loaded = true;
      }
      if (args[0] === 'init') {
        const api: CalFn = Object.assign((...a: unknown[]) => push(api, a), { q: [] as unknown[] });
        const namespace = args[1];
        if (typeof namespace === 'string') {
          cal.ns![namespace] = cal.ns![namespace] ?? api;
          push(cal.ns![namespace] as CalFn, args);
          push(cal, ['initNamespace', namespace]);
        } else push(cal, args);
        return;
      }
      push(cal, args);
    },
    { q: [] as unknown[] },
  );
  w.Cal = cal;
  return cal;
}

export default function CalEmbed({ email }: { email: string }) {
  const link = process.env.NEXT_PUBLIC_CALCOM_LINK;
  const mounted = useRef(false);

  useEffect(() => {
    if (!link || mounted.current) return;
    mounted.current = true;
    const w = window as CalWindow;
    const cal = ensureCal(w);
    if (!cal.ns?.[NS]) cal('init', NS, { origin: ORIGIN });
    const api = cal.ns![NS];
    api('inline', {
      elementOrSelector: '#cal-inline',
      calLink: link,
      layout: 'month_view',
      config: { email, layout: 'month_view', theme: 'light' },
    });
    api('ui', {
      theme: 'light',
      hideEventTypeDetails: false,
      layout: 'month_view',
      cssVarsPerTheme: { light: { 'cal-brand': '#12141c', 'cal-bg': '#fbfbfd', 'cal-text': '#12141c' } },
    });
    api('on', { action: 'bookingSuccessful', callback: () => track('calendar_booked') });
  }, [link, email]);

  if (!link) {
    return (
      <p className="border-2 border-ink bg-paper-sunk p-4">
        {apply.calendarFallback.split(CONTACT_EMAIL)[0]}
        <a className="link font-bold" href={`mailto:${CONTACT_EMAIL}?subject=Design%20partner%20intro%20call`}>
          {CONTACT_EMAIL}
        </a>
        {apply.calendarFallback.split(CONTACT_EMAIL)[1]}
      </p>
    );
  }
  return <div id="cal-inline" className="min-h-[38rem] w-full overflow-auto border-2 border-ink bg-paper-raised" />;
}
