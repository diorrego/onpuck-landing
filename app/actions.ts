'use server';

import * as z from 'zod';

export type WaitlistResult = { status: 'success' | 'invalid' | 'error' };

const emailSchema = z.email();

export async function joinWaitlist(rawEmail: string): Promise<WaitlistResult> {
  const parsed = emailSchema.safeParse(String(rawEmail).trim());
  if (!parsed.success) return { status: 'invalid' };

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return { status: 'error' };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `New waitlist signup: ${parsed.data}`,
        allowed_mentions: { parse: [] },
      }),
    });
    return { status: response.ok ? 'success' : 'error' };
  } catch {
    return { status: 'error' };
  }
}
