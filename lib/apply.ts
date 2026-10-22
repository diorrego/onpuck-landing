// Validation for the design partner application, shared by the Server Action and the form.
import * as z from 'zod';

export const FIELDS = ['email', 'company', 'role', 'change', 'stack'] as const;
export type Field = (typeof FIELDS)[number];

export const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'referrer',
  'landing_path',
] as const;

export type ApplyState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: Partial<Record<Field, string>>; values: Partial<Record<Field, string>> }
  | { status: 'success'; email: string }
  | { status: 'error'; values?: Partial<Record<Field, string>> };

export function normaliseCompany(input: string): { url: string; domain: string } | null {
  const raw = input.trim();
  if (!raw || /\s/.test(raw)) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = url.hostname.toLowerCase();
    if (!host.includes('.') || host.endsWith('.')) return null;
    const href = url.href.replace(/\/$/, '');
    return { url: href, domain: host.replace(/^www\./, '') };
  } catch {
    return null;
  }
}

export const applicationSchema = z.object({
  email: z.email({ error: 'Enter a work email, like you@company.com.' }).max(200),
  company: z
    .string()
    .trim()
    .refine((v) => normaliseCompany(v) !== null, { error: 'Enter your company’s website, like company.com.' }),
  role: z.string().trim().min(2, { error: 'Tell us your role, like CTO or founder.' }).max(120),
  change: z
    .string()
    .trim()
    .min(15, { error: 'One or two sentences is enough: what changed, and what did not happen.' })
    .max(2000, { error: 'Keep it under 2,000 characters.' }),
  stack: z.string().trim().min(2, { error: 'List a few tools, like Next.js, PostHog, Sentry.' }).max(300),
});
