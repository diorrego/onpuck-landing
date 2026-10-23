import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import Figure from '@/components/figures/Figure';
import Badge, { type Tone } from '@/components/ui/Badge';
import { paper, type Step } from '@/content/paper';

const steps = (paper.sections.find((s) => s.id === 'model')!.blocks[0] as { steps: Step[] }).steps;

const tone = (status: string): Tone =>
  status.startsWith('Research') ? 'prototype' : status.startsWith('Your') ? 'neutral' : 'by-hand';

// Wide screens read the loop as a snake: 1 2 3 4 across, 5 6 7 back underneath, then up to 1.
// The DOM keeps 1 to 7 in order, so narrow screens and screen readers get a plain sequence.
const PLACE: Record<number, string> = {
  5: 'lg:col-start-4 lg:row-start-2',
  6: 'lg:col-start-3 lg:row-start-2',
  7: 'lg:col-start-2 lg:row-start-2',
};

const ARROW: Record<number, { Icon: typeof ArrowRight; at: string }> = {
  1: { Icon: ArrowRight, at: 'lg:top-1/2 lg:-right-6 lg:-mt-2' },
  2: { Icon: ArrowRight, at: 'lg:top-1/2 lg:-right-6 lg:-mt-2' },
  3: { Icon: ArrowRight, at: 'lg:top-1/2 lg:-right-6 lg:-mt-2' },
  4: { Icon: ArrowDown, at: 'lg:left-1/2 lg:-bottom-8 lg:-ml-2' },
  5: { Icon: ArrowLeft, at: 'lg:top-1/2 lg:-left-6 lg:-mt-2' },
  6: { Icon: ArrowLeft, at: 'lg:top-1/2 lg:-left-6 lg:-mt-2' },
  7: { Icon: ArrowLeft, at: 'lg:top-1/2 lg:-left-6 lg:-mt-2' },
};

export default function LoopFigure() {
  return (
    <Figure id="loop">
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
        {steps.map((s) => {
          const { Icon, at } = ARROW[s.n];
          return (
            <li key={s.n} className={`relative flex flex-col gap-1 rounded-xl border border-line bg-paper-sunk p-4 ${PLACE[s.n] ?? ''}`}>
              <span className="text-sm text-primary">Step {s.n}</span>
              <p className="text-xl leading-tight">{s.name}</p>
              <p className="text-[0.9375rem] leading-snug text-ink-soft">{s.output}</p>
              <span className="mt-auto pt-2">
                <Badge tone={tone(s.status)}>{s.status}</Badge>
              </span>
              <Icon aria-hidden="true" className={`absolute hidden size-4 text-ink-faint lg:block ${at}`} />
            </li>
          );
        })}
        <li
          aria-hidden="true"
          className="relative hidden items-center justify-center rounded-xl border border-dashed border-line-strong p-4 text-center text-sm text-ink-faint lg:col-start-1 lg:row-start-2 lg:flex"
        >
          Back to step 1
          <ArrowUp className="absolute -top-8 left-1/2 -ml-2 size-4 text-ink-faint" />
        </li>
      </ol>
    </Figure>
  );
}
