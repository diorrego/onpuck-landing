'use client';

import { BookerEmbed } from '@calcom/atoms';
import '@calcom/atoms/globals.min.css';

type Props = { username: string; eventSlug: string; email: string; onBooked?: () => void };

/** Cal.com's BookerEmbed atom. Loaded only after the application succeeds (its CSS is ~320 KB,
 * scoped to `.calcom-atoms`). */
export default function CalBooker({ username, eventSlug, email, onBooked }: Props) {
  return (
    <BookerEmbed
      username={username}
      eventSlug={eventSlug}
      view="MONTH_VIEW"
      defaultFormValues={email ? { email } : undefined}
      customClassNames={{ bookerContainer: 'rounded-xl border border-line' }}
      onCreateBookingSuccess={() => onBooked?.()}
    />
  );
}
