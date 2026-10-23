import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/apply/CalBooker', () => ({
  default: (p: { calLink: string; email: string }) => (
    <div data-testid="booker">
      {p.calLink}|{p.email}
    </div>
  ),
}));

import CalEmbed from '.';

describe('CalEmbed', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('falls back to email when no Cal.com link is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_CALCOM_LINK', '');
    render(<CalEmbed email="cto@acme.dev" contactEmail="paula@onpuck.com" fallback="Write to paula@onpuck.com with two or three times." />);
    expect(screen.getByRole('link', { name: /paula@onpuck\.com/ })).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('loads the Cal.com booker for the configured user and event, email prefilled', async () => {
    vi.stubEnv('NEXT_PUBLIC_CALCOM_LINK', 'onpuck/design-partner-intro');
    render(<CalEmbed email="cto@acme.dev" contactEmail="paula@onpuck.com" fallback="x" />);
    expect(await screen.findByTestId('booker')).toHaveTextContent('onpuck/design-partner-intro|cto@acme.dev');
  });
});
