import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CalEmbed from '.';

describe('CalEmbed', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    delete (window as { Cal?: unknown }).Cal;
  });

  it('falls back to email when no Cal.com link is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_CALCOM_LINK', '');
    render(<CalEmbed email="cto@acme.dev" contactEmail="paula@onpuck.com" fallback="Write to paula@onpuck.com with two or three times." />);
    expect(screen.getByRole('link', { name: /paula@onpuck\.com/ })).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('mounts the inline calendar with the email prefilled and page colours', () => {
    vi.stubEnv('NEXT_PUBLIC_CALCOM_LINK', 'onpuck/design-partner-intro');
    const calls: unknown[][] = [];
    const ns = Object.assign((...args: unknown[]) => calls.push(args), {});
    (window as unknown as { Cal: unknown }).Cal = Object.assign((...args: unknown[]) => calls.push(['root', ...args]), { ns: { intro: ns }, loaded: true });
    render(<CalEmbed email="cto@acme.dev" contactEmail="paula@onpuck.com" fallback="Write to paula@onpuck.com with two or three times." />);
    const inline = calls.find((c) => c[0] === 'inline') as [string, { calLink: string; config: { email: string } }];
    expect(inline[1].calLink).toBe('onpuck/design-partner-intro');
    expect(inline[1].config.email).toBe('cto@acme.dev');
    expect(calls.some((c) => c[0] === 'ui')).toBe(true);
    expect(calls.some((c) => c[0] === 'on')).toBe(true);
  });
});
