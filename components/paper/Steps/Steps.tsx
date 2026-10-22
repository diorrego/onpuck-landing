import Inline from '@/components/ui/Inline';
import StatusChip from '@/components/ui/StatusChip';
import type { Step } from '@/content/paper';

const tone = (status: string) => (status.startsWith('Research') ? 'prototype' : status.startsWith('Your') ? 'neutral' : 'by-hand');

export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid">
      {steps.map((s) => (
        <li key={s.n} id={`step-${s.n}`} className="grid gap-x-10 gap-y-3 border-t-2 border-ink/15 py-8 first:border-t-0 first:pt-0 md:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="grid content-start gap-2">
            <span className="font-pixel text-[0.6875rem] text-ink-soft">Step {s.n}</span>
            <h3 className="text-2xl leading-tight font-extrabold">{s.name}</h3>
            <span>
              <StatusChip tone={tone(s.status)}>{s.status}</StatusChip>
            </span>
          </div>
          <div className="prose-paper">
            <p className="font-semibold">{s.output}.</p>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3">
                <Inline text={p} />
              </p>
            ))}
            {s.evidence.length > 0 && (
              <div className="mt-4 border-t-2 border-dotted border-ink/30 pt-3 text-[0.9375rem] text-ink-soft">
                <p className="font-pixel text-[0.625rem] text-ink">Evidence</p>
                {s.evidence.map((p, i) => (
                  <p key={i} className="mt-1.5">
                    <Inline text={p} />
                  </p>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
