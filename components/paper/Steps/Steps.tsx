import Badge from '@/components/ui/Badge';
import Inline from '@/components/ui/Inline';
import type { Step } from '@/content/paper';

const tone = (status: string) => (status.startsWith('Research') ? 'prototype' : status.startsWith('Your') ? 'neutral' : 'by-hand');

export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {steps.map((s) => (
        <li key={s.n} id={`step-${s.n}`} className="grid gap-x-10 gap-y-3 py-7 md:grid-cols-[12rem_minmax(0,1fr)]">
          <div className="grid content-start gap-1.5">
            <span className="text-sm font-semibold text-primary">Step {s.n}</span>
            <h3 className="text-xl leading-tight font-bold">{s.name}</h3>
            <span>
              <Badge tone={tone(s.status)}>{s.status}</Badge>
            </span>
          </div>
          <div className="prose-paper">
            <p className="font-semibold text-ink">{s.output}</p>
            {s.body.map((p, i) => (
              <p key={i} className="mt-1.5 hyphens-auto text-ink-soft md:text-justify">
                <Inline text={p} />
              </p>
            ))}
            {s.evidence.map((p, i) => (
              <p key={i} className="mt-2 text-sm text-ink-faint">
                <span className="mr-1.5 font-semibold text-ink-soft">Evidence.</span>
                <Inline text={p} />
              </p>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
