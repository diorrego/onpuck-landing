// Attio REST v2: "assert" (upsert) the company by domain and the person by email, then attach
// the application as a note. Server only. Verify slugs against the workspace (PLAN 5.2).

import { applicationText, type Application } from './application';

const API = 'https://api.attio.com/v2';

export type { Application } from './application';

async function call<T>(key: string, method: string, path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Attio ${response.status} on ${method} ${path}`);
  return (await response.json()) as T;
}

type RecordResponse = { data: { id: { record_id: string } } };

export async function upsertApplication(key: string, app: Application): Promise<void> {
  const company = await call<RecordResponse>(key, 'PUT', '/objects/companies/records?matching_attribute=domains', {
    data: { values: { domains: [app.domain] } },
  });
  const person = await call<RecordResponse>(key, 'PUT', '/objects/people/records?matching_attribute=email_addresses', {
    data: {
      values: {
        email_addresses: [app.email],
        job_title: app.role,
        company: [{ target_object: 'companies', target_record_id: company.data.id.record_id }],
      },
    },
  });
  await call(key, 'POST', '/notes', {
    data: {
      parent_object: 'people',
      parent_record_id: person.data.id.record_id,
      title: 'Design partner application (onpuck.com)',
      format: 'plaintext',
      content: applicationText(app),
    },
  });
}
