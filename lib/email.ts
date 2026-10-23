// The application by email, through Resend's REST API (no SDK). Server only.
import { applicationText, type Application } from './application';

const API = 'https://api.resend.com/emails';
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

export async function sendApplicationEmail(key: string, route: { from: string; to: string }, app: Application): Promise<void> {
  const response = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: route.from,
      to: [route.to],
      reply_to: app.email,
      subject: oneLine(`Design partner application: ${app.domain} (${app.role})`).slice(0, 200),
      text: `From: ${app.email}\n\n${applicationText(app)}\n\nReply to this email to write to them directly.`,
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Resend ${response.status} on POST /emails`);
}
