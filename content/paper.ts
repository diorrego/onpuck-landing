// The light paper: single source for the page, /index.md, llms.txt and JSON-LD.
// Inline grammar (lib/inline.ts): [n] citations, `code`, **strong**, [label](href).
// Claims trace to business-vault/engineering/product-model.md. No dates in the story.
// Style (Diego, after the v1 review): concise, a paper written as marketing; brand "OnPuck".
// Open founder decisions built provisionally with the recommendation (PLAN.md):
// D1 headline (a), D5 founders named, D6 version label, D9 cohort of 5.

export const CTA_LABEL = 'Apply to be a design partner';
export const CONTACT_EMAIL = 'paula@onpuck.com';
export const VERSION = '1.0';
export const SITE_URL = 'https://www.onpuck.com';
// Metadata only (D6): never shown in the story.
export const CONTENT_UPDATED = '2026-10-22';
export const CONTENT_PUBLISHED = '2026-10-22';
export const PURPOSE_LINE = 'We exist to turn stories into evidence, and evidence into better decisions.';

export type FigureId = 'loop' | 'trackers' | 'simulated-run' | 'prediction';

export type FigureMeta = {
  id: FigureId;
  number: number;
  title: string;
  caption: string;
  synthetic: boolean;
};

export type Step = {
  n: number;
  name: string;
  output: string;
  status: string;
  body: string[];
  evidence: string[];
};

export type Pair = { paper: string; today: string; status: 'prototype' | 'by-hand' | 'designed' };
export type Limit = { title: string; because: string; mitigation: string };
export type Faq = { q: string; a: string[] };

export type Block =
  | { type: 'p'; text: string }
  | { type: 'thesis'; lines: string[] }
  | { type: 'figure'; figure: FigureId }
  | { type: 'steps'; steps: Step[] }
  | { type: 'formula'; label: string; code: string; note: string }
  | { type: 'list'; items: string[] }
  | { type: 'experiments' }
  | { type: 'pairs'; pairs: Pair[] }
  | { type: 'limits'; limits: Limit[] }
  | { type: 'program' }
  | { type: 'apply' }
  | { type: 'faq' };

export type Section = {
  id: string;
  number?: string;
  nav?: string;
  /** Short label for the contents rail; `title` is the descriptive H2 people search for. */
  short?: string;
  title: string;
  lede: string;
  blocks: Block[];
};

const abstract =
  'OnPuck checks what your users say against what your system recorded. It interviews users about one recent episode, verifies every detail read-only in your repo, analytics and logs, writes specs your coding agent can ship, and tests each spec on simulated users before it is built.';

const figures: FigureMeta[] = [
  {
    id: 'loop',
    number: 1,
    title: 'The loop',
    caption: 'Seven steps, one loop. Steps 1 to 4 run by hand today; step 5 is a research prototype.',
    synthetic: false,
  },
  {
    id: 'trackers',
    number: 2,
    title: 'One story, resolved',
    caption: 'Synthetic example. One sentence, four trackers, one contradiction, and the contradiction changes the spec.',
    synthetic: true,
  },
  {
    id: 'simulated-run',
    number: 3,
    title: 'Simulated run',
    caption: 'Illustration replaying our registered exp-04 prediction for a live A/B on woku. Drawn, not recorded.',
    synthetic: true,
  },
  {
    id: 'prediction',
    number: 4,
    title: 'Prediction vs reality',
    caption: 'Change in review submissions between two versions of woku, on mobile. Bars are 95% intervals. Real data.',
    synthetic: false,
  },
];

const steps: Step[] = [
  {
    n: 1,
    name: 'Connect',
    output: 'Trackers verified against live data',
    status: 'Specified, run by hand',
    body: ['An agent reads your repo, analytics and logs, and keeps only the trackers that show up in live data.'],
    evidence: [
      'Agents solve 21.3% of real enterprise SQL tasks without schema context [23, 24], and can trace errors in logs [25, 26].',
    ],
  },
  {
    n: 2,
    name: 'Listen',
    output: 'One concrete story per interview',
    status: 'Specified, run by hand',
    body: ['A 10-minute AI interview about one recent episode, guided by your data. Never "would you use it?"'],
    evidence: ['AI interviewers match human ones [28, 29, 30]; concrete incidents beat opinions [31, 16].'],
  },
  {
    n: 3,
    name: 'Anchor',
    output: 'Each detail confirmed or contradicted',
    status: 'Specified, run by hand',
    body: ['Every tracker is resolved against your system. Contradictions are kept: that is where the spec changes.'],
    evidence: ['Self-reports rarely match logs [32]; time landmarks improve recall [33].'],
  },
  {
    n: 4,
    name: 'Spec',
    output: 'A spec with the evidence attached',
    status: 'Specified, run by hand',
    body: ['Each spec carries an action type (`fix`, `build`, `refactor`, `remove`) and the queries behind it.'],
    evidence: ['Coding agents fail on underspecified tasks [21, 22, 34].'],
  },
  {
    n: 5,
    name: 'Simulate',
    output: 'A predicted change, with an interval',
    status: 'Research prototype',
    body: ['Simulated users calibrated on your sessions run your preview build and predict what changes.'],
    evidence: ['LLM simulations predict the direction of experiments [5, 6] and find usability problems [7].'],
  },
  {
    n: 6,
    name: 'Ship',
    output: 'The change in production',
    status: 'Your coding agent',
    body: ['Your agent implements the spec, delivered over MCP [27].'],
    evidence: [],
  },
  {
    n: 7,
    name: 'Calibrate',
    output: 'An accuracy record',
    status: 'By hand in exp-01 to exp-04',
    body: ['We compare prediction and reality, then recalibrate. Model versions are pinned [13].'],
    evidence: [],
  },
];

const pairs: Pair[] = [
  { paper: 'Agents grounded in interviews beat demographic ones [1, 2, 3].', today: 'Simulated users start from your sessions and interviews.', status: 'prototype' },
  { paper: 'LLM agents act too efficient and know too much [4, 6].', today: 'A state layer decides when someone gets tired or quits.', status: 'prototype' },
  { paper: 'Simulations get the direction right and the size wrong [5].', today: 'We report a direction and an interval, never exact magnitudes.', status: 'prototype' },
  { paper: 'Verbalized sampling restores diversity lost to tuning [17, 18, 19].', today: 'The model proposes actions with probabilities; code samples them.', status: 'prototype' },
  { paper: 'Keystroke-level models predict task time [20].', today: 'Time per action is fitted on real sessions.', status: 'prototype' },
  { paper: 'World models learn how apps respond [8, 9, 10, 11].', today: 'We run your real preview build instead.', status: 'prototype' },
  { paper: 'Cognitive models, identity labels and twins distort people [12, 14, 15].', today: 'Every prediction is scored against "nothing changes". Misses are published.', status: 'by-hand' },
  { paper: 'AI interviewers match human ones [28, 29, 30].', today: '10-minute AI interviews about one recent episode.', status: 'by-hand' },
  { paper: 'Agents on real data need its schema, values and code [23, 24, 25, 26].', today: 'Trackers are verified against live data before any interview.', status: 'by-hand' },
  { paper: 'Clear specs and good tools make coding agents succeed [21, 22, 34].', today: 'Specs carry their evidence, designed to reach your agent over MCP [27].', status: 'designed' },
];

const limits: Limit[] = [
  { title: 'Exact magnitudes', because: 'Simulations overestimate effect sizes [5].', mitigation: 'We give a direction and an interval, scored against "nothing changes".' },
  { title: 'Brand-new features', because: 'Hypothetical answers flatter [16]; twins transfer poorly to new behaviour [14].', mitigation: 'We test changes to flows people already use.' },
  { title: 'One person’s exact session', because: 'Next-action accuracy is 11 to 21% [35, 36].', mitigation: 'We predict rates across a population, never one person.' },
  { title: 'Replacing interviews', because: 'Without real input, simulated people are generic [15].', mitigation: 'Interviews feed every step.' },
  { title: 'Stable results across models', because: 'Results shift with prompts and models [13].', mitigation: 'Model versions are pinned and baselines re-run.' },
  { title: 'Proof on steps 1 to 3', because: 'Our experiments so far cover the simulator only.', mitigation: 'The first design partner is that experiment.' },
];

const faq: Faq[] = [
  {
    q: 'What access do you need, and can you write to our systems?',
    a: [
      'Read-only access to your repo and one data source: PostHog, Sentry, logs or a database replica. You grant it and can revoke it any time. Nothing we run writes to your systems.',
    ],
  },
  {
    q: 'How much of our time does it take?',
    a: ['Two weeks to connect, a check-in every two weeks, and introductions to a few users for 10-minute interviews.'],
  },
  {
    q: 'Is the simulator ready?',
    a: ['It is a research prototype: four experiments on woku, misses published, one blind prediction pending. Every prediction we make for you comes with an interval and gets scored.'],
  },
  {
    q: 'Does this replace talking to our users?',
    a: ['No. Interviews are the input. OnPuck checks each one against your data and turns it into a spec.'],
  },
  {
    q: 'How is this different from AI interview tools or synthetic users?',
    a: ['Interview tools don’t check stories against your data. Synthetic users simulate opinions and publish no accuracy. Analytics shows how many, never why. OnPuck joins the three on your stack.'],
  },
  {
    q: 'What does it cost, and what happens after three months?',
    a: ['Nothing during the partnership. After three months we decide together whether to renew. Either side can stop any time.'],
  },
  {
    q: 'Who runs it?',
    a: [`The founders, P. Riquelme and D. Orrego: two engineers who research and build the models behind OnPuck, and run woku, our lab. Write to ${CONTACT_EMAIL}.`],
  },
];

export const program = {
  cohort: 5,
  terms: [
    { label: 'Length', value: '3 months, renewable' },
    { label: 'Check-in', value: 'Every two weeks' },
    { label: 'Cost', value: 'Free' },
    { label: 'Cohort', value: '5 teams in San Francisco' },
  ],
  get: [
    'Trackers your system can verify',
    'Interviews with your users, checked against your data',
    'Specs your coding agent can ship',
    'Simulated runs before you build',
    'Every prediction scored against reality',
  ],
  give: [
    'Read-only access to your repo and one data source',
    'A check-in every two weeks',
    'Intros to a few of your users',
    'Honest feedback',
  ],
  fit: [
    'You ship weekly, ideally with Claude Code, Codex or Cursor',
    'You have users in production',
    'You run PostHog, Sentry, Axiom or CloudWatch',
    'Seed to Series A, in San Francisco',
  ],
};

export const apply = {
  title: 'Apply',
  lede: 'Apply in five fields, or just book a 30-minute call with the founders.',
  fields: {
    email: { label: 'Work email', placeholder: 'you@company.com' },
    company: { label: 'Company URL', placeholder: 'company.com' },
    role: { label: 'Your role', placeholder: 'CTO, founder, head of product' },
    change: {
      label: 'A recent change that did not do what you expected',
      placeholder: 'We moved onboarding to one screen and activation did not move.',
    },
    stack: { label: 'Stack', placeholder: 'Next.js, PostHog, Sentry, Postgres, Claude Code' },
  },
  modes: { label: 'Apply or book a call', apply: 'Apply', book: 'Book a call' },
  bookLede: 'Rather talk first? Pick a 30-minute slot with the founders.',
  submit: CTA_LABEL,
  submitting: 'Sending',
  success: {
    title: 'Application received.',
    body: 'Pick a time for a 30-minute intro call.',
  },
  calendarFallback: `Write to ${CONTACT_EMAIL} with two or three times that suit you, and we will send an invite.`,
  error: `Something failed on our side and your application was not sent. Write to ${CONTACT_EMAIL} and we will reply within a working day.`,
  security: ['Read-only, revocable access', 'Nothing we run writes to your systems', 'We only interview users you introduce'],
};

// Fig. 2 (synthetic): one sentence from an interview, resolved against the system.
export const trackerExample = {
  source: 'Interview with a synthetic example user',
  quote: 'Last night I tried to export the monthly report from my phone, and it never downloaded.',
  rows: [
    { tracker: 'Time', kind: 'anchor', said: 'last night', recorded: '`export_clicked` at 21:42', resolution: 'confirmed' },
    { tracker: 'Device', kind: 'dimension', said: 'my phone', recorded: 'iOS Safari, 390 x 844', resolution: 'confirmed' },
    { tracker: 'Feature', kind: 'dimension', said: 'export the monthly report', recorded: '`POST /reports/export` returned 200', resolution: 'confirmed' },
    { tracker: 'Outcome', kind: 'dimension', said: 'it never downloaded', recorded: 'File served, 1.2 MB; never opened', resolution: 'contradicted' },
  ],
  spec: {
    actionType: 'fix',
    title: 'Make the exported file findable on iOS Safari',
    why: 'The download worked. The user could not find the file.',
    evidence: '4 trackers, 3 queries, 1 story',
  },
} as const;

// Fig. 3 interface copy.
export const simulatedRun = {
  armsLabel: 'Arm of the A/B test',
  prediction: 'Registered prediction',
  predictionNote: 'People whose first action is writing, among those who start.',
  replay: 'This replay so far',
  started: 'started',
  wroteFirst: 'wrote first',
  submitted: 'submitted',
  pending: 'Result pending. We publish it either way.',
};

export const founders = [
  { name: 'Paula Riquelme', short: 'P. Riquelme', role: 'Co-founder, engineer', line: 'Researches and builds the models behind OnPuck.', linkedin: 'https://www.linkedin.com/in/pauriquelme/' },
  { name: 'Diego Orrego', short: 'D. Orrego', role: 'Co-founder, engineer', line: 'Researches and builds the models behind OnPuck.', linkedin: 'https://www.linkedin.com/in/diorrego' },
];

export const paper = {
  title: 'OnPuck: know what your users will do before your agent builds it',
  shortTitle: 'OnPuck',
  description:
    'OnPuck checks user stories against your data, writes specs for your coding agent and tests them on simulated users. For growing startups in San Francisco, CA, USA.',
  version: VERSION,
  hero: {
    authors: 'P. Riquelme and D. Orrego',
    // The display line is a paragraph; the H1 says what, for whom and where (like the description).
    headline: 'Know what your users will do before your agent builds it.',
    h1: 'AI user research for coding agents: user stories checked against your data and specs tested on simulated users, for growing startups in San Francisco, CA, USA.',
    subline:
      'OnPuck turns user interviews into specs your coding agent can ship, checked against your real data and tested on simulated users first.',
    primaryCta: { label: CTA_LABEL, href: '#apply' },
    secondaryCta: { label: 'Read the light paper', href: '#abstract' },
    sceneLabel: 'Illustration of a simulated run',
    sceneCaption: 'Each person carries frustration, fatigue and motivation, and leaves when the section 3 rule fires. Drawn, not recorded.',
    sceneHint: 'Hover or tap a person.',
    status: { onFloor: 'on the floor', frustrated: 'frustrated now', done: 'tasks done', left: 'gave up' },
    legend: [
      { icon: 'alert', label: 'Friction' },
      { icon: 'tired', label: 'Tired' },
      { icon: 'check', label: 'Done' },
      { icon: 'leave', label: 'Leaving' },
      { icon: 'sound', label: 'Voice' },
    ],
  },
  abstract,
  figures,
  faq,
  sections: [
    {
      id: 'abstract',
      nav: 'Abstract',
      short: 'Abstract',
      title: 'What OnPuck is: AI user research for coding agents',
      lede: abstract,
      blocks: [
        {
          type: 'thesis',
          lines: ['Interviews explain why.', 'Data proves how many.', 'Trackers join the two.', 'Simulation tests the change before it is built.'],
        },
        { type: 'figure', figure: 'loop' },
      ],
    },
    {
      id: 'gap',
      number: '1',
      short: 'The gap',
      title: 'Why user interviews and product analytics disagree',
      lede: 'Interviews tell you why. Analytics tell you how many. Neither tells you if the story is true.',
      blocks: [
        {
          type: 'p',
          text: 'Across 52,007 people, self-reports about software use rarely matched the logs [32]. So OnPuck checks every **tracker**: a detail your system could have recorded, like a time, a device, a feature or an error.',
        },
        { type: 'figure', figure: 'trackers' },
      ],
    },
    {
      id: 'model',
      number: '2',
      nav: 'Model',
      short: 'The model',
      title: 'How OnPuck turns user stories into specs for your coding agent',
      lede: 'Seven steps, each backed by research or by our own experiments.',
      blocks: [{ type: 'steps', steps }],
    },
    {
      id: 'simulation',
      number: '3',
      short: 'Simulated users',
      title: 'Simulated users that get tired, frustrated and quit',
      lede: 'An LLM alone plays a user who is too efficient. We add the part that gets tired.',
      blocks: [
        {
          type: 'p',
          text: 'LLM agents take 2.5 times fewer actions than people [6], know too much [4] and flatten groups [15]. Each simulated user keeps an explicit state: frustration **R**, fatigue **F**, boredom **B**, progress **P** and motivation **M**.',
        },
        {
          type: 'formula',
          label: 'Chance of quitting at each step',
          code: 'hazard = σ(h0 + 3R + 1.5F + 1.5B − 3M − 2P)',
          note: 'h0 is fitted on real sessions ([exp-02](#exp-02)).',
        },
        { type: 'figure', figure: 'simulated-run' },
      ],
    },
    {
      id: 'evidence',
      number: '4',
      nav: 'Evidence',
      short: 'Validation',
      title: 'How accurate are simulated users? Our validation',
      lede: 'Four experiments on woku, misses included, and one blind prediction waiting for its result.',
      blocks: [
        { type: 'experiments' },
        { type: 'figure', figure: 'prediction' },
        {
          type: 'p',
          text: 'Best result so far: a simulated user found a real bug on woku’s review form ([exp-02](#exp-02)). It was fixed in production.',
        },
      ],
    },
    {
      id: 'research',
      number: '5',
      nav: 'Research',
      short: 'Research',
      title: 'The research behind AI interviews and simulated users',
      lede: 'What the research found, and what OnPuck does with it.',
      blocks: [{ type: 'pairs', pairs }],
    },
    {
      id: 'limits',
      number: '6',
      nav: 'Limits',
      short: 'Limits',
      title: 'What simulated users cannot predict',
      lede: 'What we can’t promise, and what we do about it.',
      blocks: [{ type: 'limits', limits }],
    },
    {
      id: 'program',
      number: '7',
      nav: 'Program',
      short: 'Design partners',
      title: 'Design partner program for startups in San Francisco',
      lede: 'We’re building OnPuck with 5 teams. The founders run it for you while the platform is built.',
      blocks: [{ type: 'program' }],
    },
    {
      id: 'apply',
      short: 'Apply',
      title: 'Apply to be a design partner or book a call',
      lede: apply.lede,
      blocks: [{ type: 'apply' }],
    },
    {
      id: 'faq',
      short: 'Questions',
      title: 'Questions about access, data, time and cost',
      lede: 'What CTOs ask us first.',
      blocks: [{ type: 'faq' }],
    },
  ] satisfies Section[],
};

export function figureMeta(id: FigureId): FigureMeta {
  return figures.find((f) => f.id === id)!;
}

// Every string a visitor can read, for the copy guard tests and the Markdown twin.
export function allCopy(): string[] {
  const out: string[] = [
    paper.title,
    paper.description,
    paper.hero.authors,
    paper.hero.headline,
    paper.hero.h1,
    paper.hero.subline,
    paper.hero.primaryCta.label,
    paper.hero.secondaryCta.label,
    paper.hero.sceneLabel,
    paper.hero.sceneCaption,
    paper.hero.sceneHint,
    ...Object.values(paper.hero.status),
    ...paper.hero.legend.map((l) => l.label),
    PURPOSE_LINE,
    ...figures.flatMap((f) => [f.title, f.caption]),
    ...faq.flatMap((f) => [f.q, ...f.a]),
    ...program.terms.map((t) => `${t.label} ${t.value}`),
    ...program.get,
    ...program.give,
    ...program.fit,
    apply.title,
    apply.lede,
    ...Object.values(apply.fields).flatMap((f) => [f.label, f.placeholder]),
    apply.submit,
    apply.success.title,
    apply.success.body,
    apply.error,
    apply.calendarFallback,
    ...Object.values(apply.modes),
    apply.bookLede,
    ...apply.security,
    ...founders.flatMap((f) => [f.name, f.short, f.role, f.line]),
    ...Object.values(simulatedRun),
    trackerExample.source,
    trackerExample.quote,
    ...trackerExample.rows.flatMap((r) => [r.tracker, r.said, r.recorded, r.resolution]),
    trackerExample.spec.title,
    trackerExample.spec.why,
    trackerExample.spec.evidence,
  ];
  for (const section of paper.sections) {
    out.push(section.title, section.lede, section.short ?? '');
    for (const block of section.blocks as Block[]) {
      if (block.type === 'p') out.push(block.text);
      if (block.type === 'thesis') out.push(...block.lines);
      if (block.type === 'list') out.push(...block.items);
      if (block.type === 'formula') out.push(block.label, block.code, block.note);
      if (block.type === 'steps')
        for (const s of block.steps) out.push(s.name, s.output, s.status, ...s.body, ...s.evidence);
      if (block.type === 'pairs') for (const p of block.pairs) out.push(p.paper, p.today);
      if (block.type === 'limits')
        for (const l of block.limits) out.push(l.title, l.because, l.mitigation);
    }
  }
  return out;
}
