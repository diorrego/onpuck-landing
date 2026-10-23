'use client';

import { lazy, Suspense } from 'react';
import { track } from '@/lib/analytics';

const CalBooker = lazy(() => import('@/components/apply/CalBooker'));

/** "user/event", "/user/event/" or "https://cal.com/user/event" to the booker's two ids. */
export function parseCalLink(link: string): { username: string; eventSlug: string } | null {
  const path = link.trim().replace(/^https?:\/\/[^/]+/i, '');
  const [username, eventSlug] = path.split('/').filter(Boolean);
  return username && eventSlug ? { username, eventSlug } : null;
}

type Props = { email: string; contactEmail: string; fallback: string };

/** The calendar step after a successful application: Cal.com's booker, or an email fallback. */
export default function CalEmbed({ email, contactEmail, fallback }: Props) {
  const cal = parseCalLink(process.env.NEXT_PUBLIC_CALCOM_LINK ?? '');

  if (!cal) {
    return (
      <p className="rounded-xl border border-line bg-paper-sunk p-4">
        {fallback.split(contactEmail)[0]}
        <a className="link" href={`mailto:${contactEmail}?subject=Design%20partner%20intro%20call`}>
          {contactEmail}
        </a>
        {fallback.split(contactEmail)[1]}
      </p>
    );
  }
  return (
    <div className="min-h-[34rem] w-full">
      <Suspense fallback={<p className="text-sm text-ink-soft">Loading the calendar…</p>}>
        <CalBooker username={cal.username} eventSlug={cal.eventSlug} email={email} onBooked={() => track('calendar_booked')} />
      </Suspense>
    </div>
  );
}
