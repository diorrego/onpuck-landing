import { upsertBooking } from '@/lib/attio';
import { parseBooking, verifyCalSignature } from '@/lib/cal-webhook';

// Cal.com webhook (BOOKING_CREATED): a call booked without the form still enters the Attio
// funnel. Set it up in Cal.com > Settings > Developer > Webhooks (runbook step 4).
export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  const key = process.env.ATTIO_API_KEY;
  if (!secret || !key) {
    console.error(`Cal.com webhook: ${secret ? 'ATTIO_API_KEY' : 'CAL_WEBHOOK_SECRET'} is not set`);
    return Response.json({ error: 'not configured' }, { status: 503 });
  }

  const raw = await request.text();
  if (!verifyCalSignature(raw, request.headers.get('x-cal-signature-256'), secret)) {
    return Response.json({ error: 'bad signature' }, { status: 401 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'not json' }, { status: 400 });
  }

  const booking = parseBooking(body);
  if (!booking) return Response.json({ ok: true, ignored: true });
  try {
    await upsertBooking(key, booking, { list: process.env.ATTIO_LIST || 'design_partners', stage: 'Applied' });
  } catch (error) {
    console.error(`Cal.com booking: ${error instanceof Error ? error.message : error}`);
    return Response.json({ error: 'crm' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
