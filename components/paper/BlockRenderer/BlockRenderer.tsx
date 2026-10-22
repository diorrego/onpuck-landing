import ApplyPanel from '@/components/apply/ApplyPanel';
import LoopFigure from '@/components/figures/LoopFigure';
import PredictionFigure from '@/components/figures/PredictionFigure';
import SimulatedRunFigure from '@/components/figures/SimulatedRunFigure';
import TrackerFigure from '@/components/figures/TrackerFigure';
import ExperimentsTable from '@/components/paper/ExperimentsTable';
import Faq from '@/components/paper/Faq';
import LimitsList from '@/components/paper/LimitsList';
import LineagePairs from '@/components/paper/LineagePairs';
import Program from '@/components/paper/Program';
import Steps from '@/components/paper/Steps';
import Inline from '@/components/ui/Inline';
import PixelWindow from '@/components/ui/PixelWindow';
import type { Block, FigureId } from '@/content/paper';

const FIGURES: Record<FigureId, () => React.ReactNode> = {
  loop: LoopFigure,
  trackers: TrackerFigure,
  'simulated-run': SimulatedRunFigure,
  prediction: PredictionFigure,
};

export default function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="prose-paper mt-5 first:mt-0">
          <Inline text={block.text} />
        </p>
      );
    case 'thesis':
      return (
        <ul className="grid max-w-[40rem] gap-1 text-[1.35rem] leading-snug font-extrabold tracking-[-0.015em] sm:text-[1.6rem]">
          {block.lines.map((line) => (
            <li key={line} className="grid grid-cols-[1.25rem_1fr] items-baseline gap-2">
              <span aria-hidden="true" className="inline-block size-2.5 translate-y-[-0.15em] bg-ink" />
              {line}
            </li>
          ))}
        </ul>
      );
    case 'figure': {
      const F = FIGURES[block.figure];
      return <F />;
    }
    case 'steps':
      return <Steps steps={block.steps} />;
    case 'formula':
      return (
        <div className="my-8 max-w-[44rem]">
          <PixelWindow title={block.label} bodyClassName="p-4">
            <p className="overflow-x-auto font-mono text-[0.95rem] whitespace-nowrap sm:text-lg">
              <code className="border-0 bg-transparent p-0">{block.code}</code>
            </p>
            <p className="mt-3 text-[0.9375rem] text-ink-soft">
              <Inline text={block.note} />
            </p>
          </PixelWindow>
        </div>
      );
    case 'list':
      return (
        <ul className="prose-paper mt-5 list-disc pl-5">
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case 'experiments':
      return <ExperimentsTable />;
    case 'pairs':
      return <LineagePairs pairs={block.pairs} />;
    case 'limits':
      return <LimitsList limits={block.limits} />;
    case 'program':
      return <Program />;
    case 'apply':
      return <ApplyPanel />;
    case 'faq':
      return <Faq />;
  }
}
