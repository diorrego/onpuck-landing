// One design partner application, as the Server Action hands it to Attio and to the email.

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

/** The answers as plain text: the Attio note body and the email body. */
export function applicationText(app: Application): string {
  const attribution = Object.entries(app.attribution)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return [
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
    .trim();
}
