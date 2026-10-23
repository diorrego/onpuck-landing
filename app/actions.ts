'use server';

import { ATTRIBUTION_FIELDS, FIELDS, applicationSchema, normaliseCompany, type ApplyState, type Field } from '@/lib/apply';
import { upsertApplication } from '@/lib/attio';
import { sendApplicationEmail } from '@/lib/email';
import { CONTACT_EMAIL } from '@/content/site';

function valuesOf(formData: FormData): Partial<Record<Field, string>> {
  return Object.fromEntries(FIELDS.map((f) => [f, String(formData.get(f) ?? '')]));
}

async function notifyTeam(text: string) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, allowed_mentions: { parse: [] } }),
    });
  } catch {
    // the CRM write is what matters; a failed ping is not the visitor's problem
  }
}

export async function applyDesignPartner(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const values = valuesOf(formData);
  // honeypot: people never see this field
  if (String(formData.get('website') ?? '').trim()) return { status: 'success', email: values.email ?? '' };

  const parsed = applicationSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Partial<Record<Field, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as Field;
      errors[field] ??= issue.message;
    }
    return { status: 'invalid', errors, values };
  }

  const data = parsed.data;
  const company = normaliseCompany(data.company)!;
  if (process.env.APPLY_DRY_RUN === '1') return { status: 'success', email: data.email };

  // Attio is the CRM, the email reaches a person; either one keeps the lead
  const attioKey = process.env.ATTIO_API_KEY;
  const mailKey = process.env.RESEND_API_KEY;
  const mailFrom = process.env.APPLY_EMAIL_FROM;
  const canMail = Boolean(mailKey && mailFrom);
  if (!attioKey && !canMail) return { status: 'error', values };

  const attribution = Object.fromEntries(
    ATTRIBUTION_FIELDS.map((f) => [f, String(formData.get(f) ?? '').slice(0, 300)]),
  );
  const app = {
    ...data,
    company: company.url,
    domain: company.domain,
    attribution,
    agentInvoked: formData.get('agent_invoked') === '1',
  };
  const writes = [
    ...(attioKey ? [upsertApplication(attioKey, app)] : []),
    ...(canMail ? [sendApplicationEmail(mailKey!, { from: mailFrom!, to: process.env.APPLY_EMAIL_TO || CONTACT_EMAIL }, app)] : []),
  ];
  const results = await Promise.allSettled(writes);
  for (const r of results) {
    if (r.status === 'rejected') console.error(`Design partner application: ${r.reason instanceof Error ? r.reason.message : r.reason}`);
  }
  if (results.every((r) => r.status === 'rejected')) return { status: 'error', values };
  await notifyTeam(`New design partner application: ${data.email} (${company.domain}, ${data.role})`);
  return { status: 'success', email: data.email };
}
