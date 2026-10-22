import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const action = vi.fn();
vi.mock('@/app/actions', () => ({ applyDesignPartner: (...a: unknown[]) => action(...a) }));

import ApplyForm from '.';

const fill = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/work email/i), 'cto@acme.dev');
  await user.type(screen.getByLabelText(/company url/i), 'acme.dev');
  await user.type(screen.getByLabelText(/your role/i), 'CTO');
  await user.type(screen.getByLabelText(/did not do what you expected/i), 'We moved onboarding and nothing changed.');
  await user.type(screen.getByLabelText(/stack/i), 'Next.js, PostHog');
  return user;
};

describe('ApplyForm', () => {
  beforeEach(() => {
    action.mockReset();
    delete (window as { dataLayer?: unknown }).dataLayer;
  });

  it('labels five fields with the right input types and autocomplete', () => {
    render(<ApplyForm titleId="t" />);
    expect(screen.getByLabelText(/work email/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/work email/i)).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/company url/i)).toHaveAttribute('inputmode', 'url');
    expect(screen.getByLabelText(/did not do what you expected/i).tagName).toBe('TEXTAREA');
    for (const el of screen.getAllByRole('textbox')) expect(el).toBeRequired();
  });

  it('declares a WebMCP tool without autosubmit, so a person confirms', () => {
    const { container } = render(<ApplyForm titleId="t" />);
    const form = container.querySelector('form')!;
    expect(form).toHaveAttribute('toolname', 'apply_design_partner');
    expect(form.getAttribute('tooldescription')).toMatch(/design partner/i);
    expect(form).not.toHaveAttribute('toolautosubmit');
    expect(container.querySelector('[name="email"]')).toHaveAttribute('toolparamdescription');
  });

  it('hides a honeypot from people and assistive tech', () => {
    const { container } = render(<ApplyForm titleId="t" />);
    const trap = container.querySelector('[name="website"]')!;
    expect(trap).toHaveAttribute('tabindex', '-1');
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('fills attribution from the URL', () => {
    window.history.replaceState(null, '', '/?utm_source=hn&utm_campaign=launch');
    const { container } = render(<ApplyForm titleId="t" />);
    expect(container.querySelector('[name="utm_source"]')).toHaveValue('hn');
    expect(container.querySelector('[name="utm_campaign"]')).toHaveValue('launch');
  });

  it('tracks form_start once, on the first interaction', async () => {
    render(<ApplyForm titleId="t" />);
    fireEvent.focus(screen.getByLabelText(/work email/i));
    fireEvent.focus(screen.getByLabelText(/company url/i));
    const events = ((window as unknown as { dataLayer: { event: string }[] }).dataLayer ?? []).map((e) => e.event);
    expect(events.filter((e) => e === 'form_start')).toHaveLength(1);
  });

  it('shows field errors next to their inputs', async () => {
    action.mockResolvedValue({ status: 'invalid', errors: { email: 'Enter a work email, like you@company.com.' }, values: {} });
    render(<ApplyForm titleId="t" />);
    const user = await fill();
    await user.click(screen.getByRole('button', { name: 'Apply to be a design partner' }));
    const email = await screen.findByLabelText(/work email/i);
    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'));
    expect(email).toHaveAccessibleDescription(/you@company\.com/);
    await waitFor(() => expect(email).toHaveFocus());
  });

  it('on success swaps the form for the calendar step and tracks it', async () => {
    action.mockResolvedValue({ status: 'success', email: 'cto@acme.dev' });
    render(<ApplyForm titleId="t" />);
    const user = await fill();
    await user.click(screen.getByRole('button', { name: 'Apply to be a design partner' }));
    expect(await screen.findByText('Application received.')).toBeInTheDocument();
    const events = (window as unknown as { dataLayer: { event: string }[] }).dataLayer.map((e) => e.event);
    expect(events).toContain('form_submit_success');
  });

  it('on a server error offers the email fallback and keeps the values', async () => {
    action.mockResolvedValue({ status: 'error', values: { email: 'cto@acme.dev' } });
    render(<ApplyForm titleId="t" />);
    const user = await fill();
    await user.click(screen.getByRole('button', { name: 'Apply to be a design partner' }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('paula@onpuck.com');
    expect(alert.querySelector('a')).toHaveAttribute('href', expect.stringMatching(/^mailto:paula@onpuck\.com/));
  });
});
