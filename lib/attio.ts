// Attio REST v2: "assert" (upsert) the company by domain and the person by email, then attach
// the application as a note. Server only. Verify slugs against the workspace (PLAN 5.2).

const API = 'https://api.attio.com/v2';

export type Application = {
  email: string;
  company: string;
  domain: string;
  role: string;
  change: string;
  stack: string;
  attribution: Record<string, string>;
  agentInvoked: boolean;
};

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
  const attribution = Object.entries(app.attribution)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  await call(key, 'POST', '/notes', {
    data: {
      parent_object: 'people',
      parent_record_id: person.data.id.record_id,
      title: 'Design partner application (onpuck.com)',
      format: 'plaintext',
      content: [
        `Company: ${app.company}`,
        `Role: ${app.role}`,
        `Stack: ${app.stack}`,
        '',
        'A recent change that did not do what they expected:',
        app.change,
        '',
        attribution || 'No attribution',
        app.agentInvoked ? 'Submitted through a browser agent (WebMCP).' : '',
      ]
        .join('\n')
        .trim(),
    },
  });
}
