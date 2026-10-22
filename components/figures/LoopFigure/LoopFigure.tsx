import Figure from '@/components/figures/Figure';
import StatusChip, { type Tone } from '@/components/ui/StatusChip';
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

function Arrow({ dir, className = '' }: { dir: 'right' | 'down' | 'left' | 'up'; className?: string }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg viewBox="0 0 12 12" width="18" height="18" shapeRendering="crispEdges" aria-hidden="true" className={className} style={{ transform: `rotate(${rot}deg)` }}>
      <rect x="0" y="5" width="8" height="2" fill="currentColor" />
      <rect x="6" y="3" width="2" height="6" fill="currentColor" />
      <rect x="8" y="4" width="2" height="4" fill="currentColor" />
      <rect x="10" y="5" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

const ARROW: Record<number, { dir: 'right' | 'down' | 'left'; at: string }> = {
  1: { dir: 'right', at: 'lg:top-1/2 lg:-right-[1.6rem] lg:-mt-[9px]' },
  2: { dir: 'right', at: 'lg:top-1/2 lg:-right-[1.6rem] lg:-mt-[9px]' },
  3: { dir: 'right', at: 'lg:top-1/2 lg:-right-[1.6rem] lg:-mt-[9px]' },
  4: { dir: 'down', at: 'lg:left-1/2 lg:-bottom-[2.1rem] lg:-ml-[9px]' },
  5: { dir: 'left', at: 'lg:top-1/2 lg:-left-[1.6rem] lg:-mt-[9px]' },
  6: { dir: 'left', at: 'lg:top-1/2 lg:-left-[1.6rem] lg:-mt-[9px]' },
  7: { dir: 'left', at: 'lg:top-1/2 lg:-left-[1.6rem] lg:-mt-[9px]' },
};

export default function LoopFigure() {
  return (
    <Figure id="loop">
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
        {steps.map((s) => (
          <li key={s.n} className={`relative flex flex-col gap-1 border-2 border-ink bg-paper p-3 ${PLACE[s.n] ?? ''}`}>
            <span className="font-pixel text-[0.6875rem] text-ink-soft">Step {s.n}</span>
            <p className="text-xl leading-tight font-bold">{s.name}</p>
            <p className="text-[0.9375rem] leading-snug text-ink-soft">{s.output}</p>
            <span className="mt-auto pt-2">
              <StatusChip tone={tone(s.status)}>{s.status}</StatusChip>
            </span>
            <Arrow dir={ARROW[s.n].dir} className={`absolute hidden text-ink lg:block ${ARROW[s.n].at}`} />
          </li>
        ))}
        <li
          aria-hidden="true"
          className="relative hidden items-center justify-center border-2 border-dashed border-ink-soft p-3 text-center text-sm font-semibold text-ink-soft lg:col-start-1 lg:row-start-2 lg:flex"
        >
          Back to step 1
          <Arrow dir="up" className="absolute -top-[2.1rem] left-1/2 -ml-[9px] text-ink" />
        </li>
      </ol>
    </Figure>
  );
}
