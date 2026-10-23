import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const calProps = vi.fn((props: Record<string, unknown>) => (props ? null : null));
const api = vi.fn();
vi.mock('@calcom/embed-react', () => ({
  default: (p: Record<string, unknown>) => calProps(p),
  getCalApi: async () => api,
}));

import CalBooker from '.';

describe('CalBooker', () => {
  it('embeds the event inline in month view with the email prefilled', () => {
    render(<CalBooker calLink="paulariquelme/30min" email="cto@acme.dev" />);
    expect(calProps.mock.calls[0][0]).toMatchObject({
      calLink: 'paulariquelme/30min',
      namespace: 'intro',
      config: { layout: 'month_view', theme: 'light', email: 'cto@acme.dev' },
    });
  });

  it('sets the page colour and reports a booking', async () => {
    const onBooked = vi.fn();
    render(<CalBooker calLink="paulariquelme/30min" email="" onBooked={onBooked} />);
    await waitFor(() => expect(api).toHaveBeenCalledWith('on', expect.objectContaining({ action: 'bookingSuccessful' })));
    expect(api).toHaveBeenCalledWith('ui', expect.objectContaining({ cssVarsPerTheme: expect.objectContaining({ light: { 'cal-brand': '#1d4ed8' } }) }));
    const on = api.mock.calls.find((c) => c[0] === 'on')![1] as { callback: () => void };
    on.callback();
    expect(onBooked).toHaveBeenCalled();
  });

  it('removes its booking listener on unmount, so a later booker never reports one booking twice', async () => {
    api.mockClear();
    const { unmount } = render(<CalBooker calLink="paulariquelme/30min" email="" onBooked={() => {}} />);
    await waitFor(() => expect(api).toHaveBeenCalledWith('on', expect.anything()));
    const on = api.mock.calls.find((c) => c[0] === 'on')![1] as { callback: () => void };
    unmount();
    await waitFor(() => expect(api).toHaveBeenCalledWith('off', { action: 'bookingSuccessful', callback: on.callback }));
  });
});
