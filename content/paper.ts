// The light paper: single source for the page, /index.md, llms.txt and JSON-LD.
// Inline grammar (lib/inline.ts): [n] citations, `code`, **strong**, [label](href).
// Claims trace to business-vault/engineering/product-model.md. No dates in the story.
// Open founder decisions built provisionally with the recommendation (PLAN.md):
// D1 headline (a), D5 founders named, D6 version label, D9 cohort of 5.

export const CTA_LABEL = 'Apply to be a design partner';
export const CONTACT_EMAIL = 'paula@onpuck.com';
export const VERSION = '1.0';
export const SITE_URL = 'https://www.onpuck.com';
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
  title: string;
  lede: string;
  blocks: Block[];
};

const abstract =
  'onpuck is a research system for teams that ship with coding agents. It connects read-only to your repo, analytics, observability and database, interviews your users about one recent episode, checks every detail against your data, writes specs your agent can implement, and tests each spec on simulated users calibrated on your own sessions.';

const figures: FigureMeta[] = [
  {
    id: 'loop',
    number: 1,
    title: 'The loop',
    caption:
      'Seven steps, one loop. Steps 1 to 4 are specified and run by hand by the founders today; step 5 is a research prototype; step 6 is your coding agent; step 7 closes the loop.',
    synthetic: false,
  },
  {
    id: 'trackers',
    number: 2,
    title: 'One story, resolved',
    caption:
      'Synthetic example. One sentence from an interview, split into trackers and resolved against the system. The contradiction changes the spec.',
    synthetic: true,
  },
  {
    id: 'simulated-run',
    number: 3,
    title: 'Simulated run',
    caption:
      'Illustration of a simulated run, replaying onpuck’s registered exp-04 prediction for woku’s live A/B. Each person carries frustration, fatigue and motivation. The people are drawn, not recorded sessions.',
    synthetic: true,
  },
  {
    id: 'prediction',
    number: 4,
    title: 'Prediction vs reality',
    caption:
      'Change in review submission rate between two versions of woku’s review app, QR on mobile. Bars are 95% intervals. Real data from exp-01 to exp-03.',
    synthetic: false,
  },
];

const steps: Step[] = [
  {
    n: 1,
    name: 'Connect',
    output: 'A catalogue of trackers verified against live data',
    status: 'Specified, run by hand',
    body: [
      'An agent clones your repo and reads your analytics calls, data models and log configuration. It keeps a tracker only if it shows up in your live data in the last 30 days, and a person approves the catalogue.',
    ],
    evidence: [
      'Querying real company data is hard without knowing the schema and its values: an agent solves 21.3% of enterprise text-to-SQL tasks against 91.2% on the classic benchmark [23], and dirty real values drop accuracy to 40% against 93% for people [24]. So the catalogue is verified before any interview.',
      'Agents do work inside real repos and logs when the interface is good [21, 22, 25, 26]. Access goes through scoped, read-only tools [27].',
    ],
  },
  {
    n: 2,
    name: 'Listen',
    output: 'One story per interview, with the values the user stated',
    status: 'Specified, run by hand',
    body: [
      'An AI interviewer talks to one of your users for about 10 minutes about one recent episode: "When was the last time you exported a report?" It follows the trackers as the story reveals them. Your data guides the questions and is never spoken.',
    ],
    evidence: [
      'A chatbot drew more informative, specific and clear answers than a form [28], and AI interviewers reach quality comparable to human ones [29, 30].',
      'Asking about a concrete incident, not opinions, is a method with a long record [31]. Asking "would you use it?" gets vague, favourable answers [16].',
    ],
  },
  {
    n: 3,
    name: 'Anchor',
    output: 'Each tracker confirmed, contradicted or without data',
    status: 'Specified, run by hand',
    body: [
      'Anchors place the story (who, when); dimensions narrow it (device, feature, entity). After the call each one is resolved against your system: `confirmed`, `contradicted`, `insufficient_data` or `not_asked`. Contradictions are kept, because they are where the spec changes.',
    ],
    evidence: [
      'People’s reports of their own software use rarely match the logs [32], which is why every tracker is checked. Time landmarks first improve recall of when things happened [33].',
    ],
  },
  {
    n: 4,
    name: 'Spec',
    output: 'A prioritised spec with the evidence attached',
    status: 'Specified, run by hand',
    body: [
      'Each spec has an action type (`fix`, `build`, `refactor` or `remove`), the stories behind it, the tracker resolutions and the queries that back them. Your coding agent opens the evidence, not a summary of it.',
    ],
    evidence: [
      'Coding agents fail on underspecified tasks: building SWE-bench Verified, 93 developers screened 1,699 tasks and kept 500 [34].',
    ],
  },
  {
    n: 5,
    name: 'Simulate',
    output: 'A predicted change per metric, with an interval and a verdict',
    status: 'Research prototype',
    body: [
      'Before your agent builds the spec, simulated users calibrated on your own sessions run your preview build in a sandboxed browser. The verdict is `proceed`, `revise` or `discard`. Section 3 explains how the simulated users work.',
    ],
    evidence: [
      'LLM simulations predict the direction of experiments about as well as expert forecasters, and overestimate effect sizes [5]. Agent populations reproduced the direction of a large A/B test [6], and simulated users find usability problems [7].',
    ],
  },
  {
    n: 6,
    name: 'Ship',
    output: 'The change in production, ideally behind a flag',
    status: 'Your coding agent',
    body: [
      'Your agent implements the spec in your repo, with your review. The specs and their evidence are designed to reach it over MCP [27].',
    ],
    evidence: [],
  },
  {
    n: 7,
    name: 'Calibrate',
    output: 'An accuracy record, and updated simulator parameters',
    status: 'By hand in exp-01 to exp-04',
    body: [
      'After the change ships, onpuck compares the prediction with what happened, scores it against "nothing changes" and a generic prior, and recalibrates. Model versions are pinned, because results drift with prompts and models [13].',
    ],
    evidence: [],
  },
];

const pairs: Pair[] = [
  {
    paper: 'Agents grounded in interviews beat agents built from demographics [1, 2]; demographic backstories reproduce group patterns [3].',
    today: 'Each simulated user starts from your segments and sessions, and from interviews once they exist.',
    status: 'prototype',
  },
  {
    paper: 'LLM agents act efficient and know too much [4, 6].',
    today: 'An explicit state layer in code decides when a person slows down, gets frustrated or quits.',
    status: 'prototype',
  },
  {
    paper: 'Simulations get the direction of experiments right and the size wrong [5].',
    today: 'We report a direction and an interval, never an exact magnitude.',
    status: 'prototype',
  },
  {
    paper: 'Verbalized sampling restores diversity lost to mode collapse [19]; instruction tuning narrows outputs [17, 18].',
    today: 'The model proposes three actions with probabilities, and code samples among them.',
    status: 'prototype',
  },
  {
    paper: 'The keystroke-level model predicts task time from simple operators [20].',
    today: 'Time per action starts from those operators and is fitted on real sessions.',
    status: 'prototype',
  },
  {
    paper: 'World models learn how an environment responds [8, 9], including web pages and app screens [10, 11].',
    today: 'We run your real preview build in a sandboxed browser instead of a learned model of it.',
    status: 'prototype',
  },
  {
    paper: 'Foundation models of cognition still fail outside their training [12]; identity labels flatten groups [15]; twins distort [14].',
    today: 'Every prediction is scored against "nothing changes" and a generic prior, and misses are published.',
    status: 'by-hand',
  },
  {
    paper: 'Simulated users find usability problems before real participants do [7].',
    today: 'In [exp-02](#exp-02) a simulated user found a form bug on woku that was then fixed in production.',
    status: 'prototype',
  },
  {
    paper: 'Agents on enterprise data need its schema, values and code [23, 24].',
    today: 'The tracker catalogue is verified against live data before any interview.',
    status: 'by-hand',
  },
  {
    paper: 'Agents can read logs and traces to find a root cause [25, 26].',
    today: 'Errors a user mentions are looked up in your observability before they enter a spec.',
    status: 'by-hand',
  },
  {
    paper: 'AI interviewers match human ones on quality and scale further [28, 29, 30].',
    today: 'A 10-minute AI interview about one recent episode, with trackers as the guide.',
    status: 'by-hand',
  },
  {
    paper: 'Concrete incidents and time landmarks give accurate recall [31, 33]; self-reports rarely match logs [32].',
    today: 'Interviews ask about the last time, time first, and every detail is checked against data.',
    status: 'by-hand',
  },
  {
    paper: 'Real issues need clear specs and agent-friendly interfaces [21, 22, 34].',
    today: 'Specs carry an action type, the stories and the queries, designed to reach your agent over MCP [27].',
    status: 'designed',
  },
];

const limits: Limit[] = [
  {
    title: 'Exact magnitudes',
    because: 'Simulations overestimate effect sizes [5].',
    mitigation:
      'We predict the direction and an interval, and score each prediction against "nothing changes" and a generic prior.',
  },
  {
    title: 'Adoption of a brand-new feature',
    because:
      'Hypothetical answers are favourable [16], and digital twins transfer poorly to new behaviour [14].',
    mitigation:
      'We test changes to flows people already use, and interviews ask about past episodes, never about intentions.',
  },
  {
    title: 'One person’s exact session',
    because: 'Predicting a real user’s next action is right only 11 to 21% of the time [35, 36].',
    mitigation: 'We predict rates across a population of simulated users, never what one person will do.',
  },
  {
    title: 'Replacing talking to users',
    because:
      'The simulator is calibrated on interviews and sessions; without them it is generic, and generic simulated people flatten real ones [15].',
    mitigation: 'Interviews are the input to every step. The simulator only tests what they produced.',
  },
  {
    title: 'Stable results across models',
    because: 'Results shift with prompts and model versions [13].',
    mitigation: 'Model versions are pinned per prediction and baselines are re-run when they change.',
  },
  {
    title: 'Proof on steps 1 to 3',
    because:
      'Our experiments cover the simulator. No onpuck experiment yet measures interviews and trackers on a real customer.',
    mitigation:
      'The first design partner is that experiment: we measure the share of trackers confirmed and contradicted, and how many stories become specs.',
  },
];

const faq: Faq[] = [
  {
    q: 'What access do you need, and can you write to our systems?',
    a: [
      'Read-only access to your repo and at least one data source: PostHog, Sentry, logs or a database replica. Today the founders run the model for you with agents and scripts, using credentials you grant and can revoke at any time. Nothing we run writes to your systems.',
      'The platform we are building with partners enforces read-only access in three layers: credential grants, connector flags such as `SELECT`-only roles, and tool allowlists, with one isolated, short-lived run per job.',
    ],
  },
  {
    q: 'How much of our time does it take?',
    a: [
      'Connecting the repo and one data source in the first two weeks, a check-in every two weeks with whoever decides what gets built, and introductions to a few of your users for 10-minute interviews.',
    ],
  },
  {
    q: 'Is the simulator ready?',
    a: [
      'It is a research prototype. It has run four experiments on woku, with the misses published in section 4, and one blind prediction is waiting for its result. Every prediction we make for you comes with an interval and is scored after the change ships.',
    ],
  },
  {
    q: 'Does this replace talking to our users?',
    a: [
      'No. Interviews are the input. onpuck makes each conversation count by checking it against your data and turning it into a spec your agent can implement.',
    ],
  },
  {
    q: 'How is this different from AI interview tools or synthetic users?',
    a: [
      'AI-moderated research tools talk to real people but do not check their stories against your product’s data. Synthetic-user products simulate attitudes and publish no accuracy. Analytics shows how many, never why. onpuck joins the three on your own stack, and publishes how often it is right.',
    ],
  },
  {
    q: 'What does it cost, and what happens after three months?',
    a: [
      'Nothing during the partnership. After three months we decide together whether to renew. Either side can end it at any time.',
    ],
  },
  {
    q: 'Who runs it?',
    a: [
      `The two founders, Diego and Paula, who also run woku, the feedback product in production that serves as onpuck’s lab. Write to ${CONTACT_EMAIL}.`,
    ],
  },
];

export const program = {
  cohort: 5,
  terms: [
    { label: 'Length', value: '3 months, renewable' },
    { label: 'Check-in', value: 'Every two weeks' },
    { label: 'Cost', value: 'Free during the partnership' },
    { label: 'Cohort', value: '5 teams in San Francisco' },
  ],
  get: [
    'A catalogue of the trackers your system can verify, built from your repo and live data.',
    'Interviews with your users about recent episodes, each story checked against your data.',
    'Specs your coding agent can implement, with the evidence attached.',
    'Simulated runs of a spec on your preview build before it ships.',
    'Every prediction we make for you, scored against what happened.',
  ],
  give: [
    'Read-only access to your repo and one data source in the first two weeks.',
    'A check-in every two weeks with the person who decides what gets built.',
    'Introductions to a few of your users for 10-minute interviews.',
    'Honest feedback, including when something does not work.',
  ],
  fit: [
    'You ship every week, ideally with Claude Code, Codex or Cursor.',
    'You have users in production you can introduce us to.',
    'You run analytics or observability (PostHog, Sentry, Axiom, CloudWatch) and a repo we can read.',
    'You are a seed to Series A team in San Francisco.',
  ],
};

export const apply = {
  title: 'Apply',
  lede: 'Five fields, then pick a time for a 30-minute intro call with the founders.',
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
  submit: CTA_LABEL,
  submitting: 'Sending',
  success: {
    title: 'Application received.',
    body: 'Pick a time for a 30-minute intro call with Diego or Paula.',
  },
  error: `Something failed on our side and your application was not sent. Write to ${CONTACT_EMAIL} and we will reply within a working day.`,
  security: [
    'Read-only credentials you grant and can revoke at any time.',
    'Nothing we run writes to your systems.',
    'Your users are interviewed only after you introduce them.',
  ],
};

export const founders = [
  { name: 'Diego', role: 'Co-founder', line: 'Builds the simulator and runs the experiments.' },
  {
    name: 'Paula',
    role: 'Co-founder',
    line: `Runs the design partner program. Your first contact: ${CONTACT_EMAIL}.`,
  },
];

export const paper = {
  title: 'onpuck: users’ stories, checked against your data, tested on simulated users',
  shortTitle: 'onpuck',
  description:
    'onpuck checks your users’ stories against your repo, analytics and logs, turns them into specs for your coding agent, and tests each spec on simulated users first.',
  version: VERSION,
  hero: {
    kicker: `A light paper on the onpuck model · Version ${VERSION}`,
    headline: 'Know what your users will do before your agent builds it.',
    subline:
      'onpuck interviews your users, checks every story against your repo, analytics and logs, and turns it into specs for your coding agent. Before a spec is built, simulated users calibrated on your own sessions test it.',
    primaryCta: { label: CTA_LABEL, href: '#apply' },
    secondaryCta: { label: 'Read the light paper', href: '#abstract' },
    sceneLabel: 'Illustration of a simulated run',
  },
  abstract,
  figures,
  faq,
  sections: [
    {
      id: 'abstract',
      nav: 'Abstract',
      title: 'Abstract',
      lede: abstract,
      blocks: [
        {
          type: 'thesis',
          lines: [
            'Interviews explain why.',
            'Data proves how many.',
            'Trackers join the two.',
            'Simulation tests the change before it is built.',
          ],
        },
        { type: 'figure', figure: 'loop' },
      ],
    },
    {
      id: 'gap',
      number: '1',
      title: 'The gap',
      lede: 'Interviews tell you why and analytics tell you how many, but neither tells you whether the story a user tells matches what happened.',
      blocks: [
        {
          type: 'p',
          text: 'Across 106 comparisons and 52,007 people, what people reported about their own digital media use correlated only moderately with the logs, and was rarely accurate [32]. Product teams build on those reports anyway: a quote from a call becomes a ticket, and the ticket becomes code.',
        },
        {
          type: 'p',
          text: 'A **tracker** is any detail of a story that your system could have recorded: a time, a device, a feature, an error. onpuck resolves each tracker against your data, so a story stops being an anecdote and becomes evidence, confirmed or contradicted.',
        },
        { type: 'figure', figure: 'trackers' },
      ],
    },
    {
      id: 'model',
      number: '2',
      nav: 'Model',
      title: 'The model',
      lede: 'Seven steps. Each produces an artifact the next one needs, and each claim below points to a paper or to our own experiments.',
      blocks: [{ type: 'steps', steps }],
    },
    {
      id: 'simulation',
      number: '3',
      title: 'Simulated users',
      lede: 'An LLM alone simulates a user who is too efficient, too rational and too much like every other user. We add the part that gets tired.',
      blocks: [
        {
          type: 'p',
          text: 'In AgentA/B, LLM agents took about 2.5 times fewer actions and 4.5 times fewer searches than people [6]. Models "know too much" [4], collapse toward consensus after instruction tuning [17, 18], and flatten groups when given demographic labels [15].',
        },
        {
          type: 'p',
          text: 'So the LLM is the cortex, not the person. At each step it sees the visible elements of your real build and proposes three actions with probabilities [19]. Code re-weights them, adds time per action from keystroke-level operators [20], and keeps an explicit state per simulated user: frustration **R**, fatigue **F**, boredom **B**, progress **P** and motivation **M**.',
        },
        {
          type: 'formula',
          label: 'Abandon at each step',
          code: 'hazard = σ(h0 + 3R + 1.5F + 1.5B − 3M − 2P)',
          note: 'h0 is fitted out of sample on real sessions ([exp-02](#exp-02)); survival is computed in expectation, with common random numbers across arms ([exp-03](#exp-03)).',
        },
        {
          type: 'formula',
          label: 'Engage at first glance',
          code: 'p_engage = σ(α + 0.8·logit p_LLM + 2(M − 0.5) − 2R)',
          note: 'α is fitted to your real engagement rate.',
        },
        { type: 'figure', figure: 'simulated-run' },
      ],
    },
    {
      id: 'evidence',
      number: '4',
      nav: 'Evidence',
      title: 'Validation comes first',
      lede: 'Four experiments on woku, our own product in production. The misses stay in the table, and one prediction is registered before its result exists.',
      blocks: [
        { type: 'experiments' },
        { type: 'figure', figure: 'prediction' },
        {
          type: 'p',
          text: 'The most useful result so far was not a number. In [exp-02](#exp-02) a simulated user tapped the Write tab on woku’s review form, and the form submitted. Real users had been hitting the same bug, and it had been inflating the click metric we used as ground truth. It was fixed in production.',
        },
      ],
    },
    {
      id: 'research',
      number: '5',
      nav: 'Research',
      title: 'Research lineage',
      lede: 'What each line of research found, and what onpuck does with it today.',
      blocks: [{ type: 'pairs', pairs }],
    },
    {
      id: 'limits',
      number: '6',
      nav: 'Limits',
      title: 'Limits',
      lede: 'What we cannot promise, why, and what we do about it.',
      blocks: [{ type: 'limits', limits }],
    },
    {
      id: 'program',
      number: '7',
      nav: 'Program',
      title: 'Design partner program',
      lede: 'We are building onpuck with 5 teams. Until the platform exists, the founders run the model for you, by hand where it is not built yet.',
      blocks: [{ type: 'program' }],
    },
    {
      id: 'apply',
      title: apply.title,
      lede: apply.lede,
      blocks: [{ type: 'apply' }],
    },
    {
      id: 'faq',
      title: 'Questions',
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
    paper.hero.kicker,
    paper.hero.headline,
    paper.hero.subline,
    paper.hero.primaryCta.label,
    paper.hero.secondaryCta.label,
    paper.hero.sceneLabel,
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
    ...apply.security,
    ...founders.flatMap((f) => [f.name, f.role, f.line]),
  ];
  for (const section of paper.sections) {
    out.push(section.title, section.lede);
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
