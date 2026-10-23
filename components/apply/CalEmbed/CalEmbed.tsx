'use client';

import { lazy, Suspense } from 'react';
import { track } from '@/lib/analytics';
import { parseCalLink } from '@/lib/cal';

const CalBooker = lazy(() => import('@/components/apply/CalBooker'));
const onBooked = () => track('calendar_booked');

type Props = { email: string; contactEmail: string; fallback: string };

/** The calendar: Cal.com's inline embed, or an email fallback when no link is configured. */
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
        <CalBooker calLink={`${cal.username}/${cal.eventSlug}`} email={email} onBooked={onBooked} />
      </Suspense>
    </div>
  );
}
