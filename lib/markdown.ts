// The light paper as Markdown, generated from the same content as the page (no cloaking):
// served at /index.md and on Accept: text/markdown, summarised in /llms.txt.

import { exp04Arms, experiments, predictionVsReality } from '@/content/experiments';
import {
  apply,
  CONTACT_EMAIL,
  founders,
  paper,
  program,
  PURPOSE_LINE,
  SITE_URL,
  trackerExample,
  VERSION,
  figureMeta,
  type Block,
  type FigureId,
  type Step,
} from '@/content/paper';
import { references } from '@/content/references';

const abs = (text: string) => text.replace(/\]\(#([^)]+)\)/g, `](${SITE_URL}/#$1)`);
const cell = (text: string) => abs(text).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const table = (head: string[], rows: string[][]) =>
  [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');

function figure(id: FigureId): string {
  const meta = figureMeta(id);
  const head = `**Figure ${meta.number}. ${meta.title}.** ${abs(meta.caption)}`;
  switch (id) {
    case 'loop': {
      const steps = (paper.sections.find((s) => s.id === 'model')!.blocks[0] as { steps: Step[] }).steps;
      return `${head}\n\n${table(['Step', 'Output', 'Status'], steps.map((s) => [`${s.n} ${s.name}`, s.output, s.status]))}`;
    }
    case 'trackers':
      return [
        head,
        `> "${trackerExample.quote}"`,
        table(
          ['Tracker', 'User said', 'System recorded', 'Resolution'],
          trackerExample.rows.map((r) => [`${r.tracker} (${r.kind})`, r.said, r.recorded, r.resolution]),
        ),
        `Spec: \`${trackerExample.spec.actionType}\` ${trackerExample.spec.title}. ${trackerExample.spec.why} Evidence: ${trackerExample.spec.evidence}.`,
      ].join('\n\n');
    case 'simulated-run':
      return `${head}\n\n${table(
        ['Arm', 'Registered prediction: first action is writing'],
        (['control', 'test'] as const).map((a) => [exp04Arms[a].label, `${Math.round(exp04Arms[a].firstActionWriting * 100)}%`]),
      )}\n\nResult pending.`;
    case 'prediction':
      return `${head}\n\n${table(
        ['Source', 'Change in submission rate [95% interval]'],
        predictionVsReality.map((r) => [r.label, r.low !== undefined ? `${r.point} [${r.low}, ${r.high}]` : `${r.point}`]),
      )}`;
  }
}

function block(b: Block): string {
  switch (b.type) {
    case 'p':
      return abs(b.text);
    case 'thesis':
      return b.lines.map((l) => `- ${l}`).join('\n');
    case 'figure':
      return figure(b.figure);
    case 'steps':
      return b.steps
        .map((s) =>
          [
            `### Step ${s.n}: ${s.name}`,
            `Output: ${s.output}. Status: ${s.status}.`,
            ...s.body.map(abs),
            ...(s.evidence.length ? [`Evidence: ${s.evidence.map(abs).join(' ')}`] : []),
          ].join('\n\n'),
        )
        .join('\n\n');
    case 'formula':
      return `${b.label}:\n\n\`\`\`\n${b.code}\n\`\`\`\n\n${abs(b.note)}`;
    case 'list':
      return b.items.map((i) => `- ${abs(i)}`).join('\n');
    case 'experiments':
      return table(
        ['Experiment', 'Question', 'n', 'Predicted', 'Real', 'Verdict'],
        experiments.map((e) => [e.id, e.question, e.n, e.predicted, e.real, `${e.outcomeLabel}. ${e.verdict}`]),
      );
    case 'pairs':
      return b.pairs.map((p) => `- ${abs(p.paper)} Today: ${abs(p.today)}`).join('\n');
    case 'limits':
      return b.limits.map((l) => `### ${l.title}\n\nWhy not: ${abs(l.because)}\n\nWhat we do: ${abs(l.mitigation)}`).join('\n\n');
    case 'program':
      return [
        program.terms.map((t) => `- ${t.label}: ${t.value}`).join('\n'),
        `What you get:\n\n${program.get.map((g) => `- ${g}`).join('\n')}`,
        `What we ask:\n\n${program.give.map((g) => `- ${g}`).join('\n')}`,
        `A good fit if:\n\n${program.fit.map((g) => `- ${g}`).join('\n')}`,
      ].join('\n\n');
    case 'apply':
      return [
        `Apply at ${SITE_URL}/#apply. The form has five fields: ${Object.values(apply.fields)
          .map((f) => f.label)
          .join(', ')}. A person reviews and submits it; then they pick a time for a 30-minute intro call. Or write to ${CONTACT_EMAIL}.`,
        `Access and data:\n\n${apply.security.map((s) => `- ${s}`).join('\n')}`,
      ].join('\n\n');
    case 'faq':
      return paper.faq.map((f) => `### ${f.q}\n\n${f.a.map(abs).join('\n\n')}`).join('\n\n');
  }
}

export function paperMarkdown(): string {
  const out: string[] = [
    `# ${paper.hero.headline}`,
    `> ${paper.abstract}`,
    `${paper.hero.subline}`,
    `onpuck light paper, version ${VERSION}. ${SITE_URL}/ · Contact: ${CONTACT_EMAIL}`,
  ];
  for (const s of paper.sections) {
    out.push(`## ${s.number ? `§${s.number} ` : ''}${s.title}`);
    if (s.id !== 'abstract') out.push(abs(s.lede));
    for (const b of s.blocks as Block[]) out.push(block(b));
  }
  out.push(
    '## References',
    references.map((r) => `[${r.id}] ${r.authors}. "${r.title}." ${r.venue}, ${r.year}. ${r.url}`).join('\n\n'),
    '## About',
    `${PURPOSE_LINE} Founders: ${founders.map((f) => `${f.name} (${f.role.toLowerCase()})`).join(', ')}. Lab: woku (https://woku.app). Contact: ${CONTACT_EMAIL}.`,
  );
  return out.join('\n\n') + '\n';
}
