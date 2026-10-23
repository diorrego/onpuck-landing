// Attio REST v2: "assert" (upsert) the company by domain and the person by email, attach the
// application as a note, then put the record in the Design Partners list at Applied. Server only.
// Verify slugs against the workspace (PLAN 5.2; runbook step 3).

import { applicationText, type Application } from './application';

const API = 'https://api.attio.com/v2';

export type { Application } from './application';

async function call<T>(key: string, method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Attio ${response.status} on ${method} ${path}`);
  return (await response.json()) as T;
}

type RecordResponse = { data: { id: { record_id: string } } };
type ListResponse = { data: { id: { list_id: string }; parent_object: string[] } };
type EntriesResponse = { data: { list_id: string }[] };

/** The list (slug or id) and the title of the stage new entries start at. */
export type Pipeline = { list: string; stage: string };

/**
 * Adds the record the list is built on (people or companies) at the first stage, unless it is
 * already in the list: applying again never moves someone back.
 */
async function addToPipeline(key: string, pipeline: Pipeline, records: Record<string, string>): Promise<void> {
  const list = await call<ListResponse>(key, 'GET', `/lists/${pipeline.list}`);
  const parent = list.data.parent_object[0];
  const recordId = records[parent];
  if (!recordId) throw new Error(`Attio list ${pipeline.list} is on ${parent}, not people or companies`);
  const entries = await call<EntriesResponse>(key, 'GET', `/objects/${parent}/records/${recordId}/entries`);
  if (entries.data.some((e) => e.list_id === list.data.id.list_id)) return;
  await call(key, 'POST', `/lists/${pipeline.list}/entries`, {
    data: { parent_object: parent, parent_record_id: recordId, entry_values: { stage: pipeline.stage } },
  });
}

export async function upsertApplication(key: string, app: Application, pipeline?: Pipeline): Promise<void> {
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
  if (!pipeline) return;
  try {
    await addToPipeline(key, pipeline, { people: person.data.id.record_id, companies: company.data.id.record_id });
  } catch (error) {
    // the person and the note are saved; a missing list or scope must not lose the lead
    console.error(`Design partner application, pipeline: ${error instanceof Error ? error.message : error}`);
  }
}
