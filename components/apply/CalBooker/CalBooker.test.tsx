import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const booker = vi.fn((props: Record<string, unknown>) => (props ? null : null));
vi.mock('@calcom/atoms', () => ({ BookerEmbed: (p: Record<string, unknown>) => booker(p) }));
vi.mock('@calcom/atoms/globals.min.css', () => ({}));

import CalBooker from '.';

describe('CalBooker', () => {
  it('passes the event, month view, prefilled email and a booking callback to BookerEmbed', () => {
    const onBooked = vi.fn();
    render(<CalBooker username="onpuck" eventSlug="intro" email="cto@acme.dev" onBooked={onBooked} />);
    const props = booker.mock.calls[0][0] as { username: string; eventSlug: string; view: string; defaultFormValues: { email: string }; onCreateBookingSuccess: () => void };
    expect(props).toMatchObject({ username: 'onpuck', eventSlug: 'intro', view: 'MONTH_VIEW', defaultFormValues: { email: 'cto@acme.dev' } });
    props.onCreateBookingSuccess();
    expect(onBooked).toHaveBeenCalled();
  });
});
