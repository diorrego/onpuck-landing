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
import Card from '@/components/ui/Card';
import Inline from '@/components/ui/Inline';

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
        <p className="prose-paper mt-5 hyphens-auto text-ink md:text-justify first:mt-0">
          <Inline text={block.text} />
        </p>
      );
    case 'thesis':
      return (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {block.lines.map((line, i) => (
            <li key={line} className="rounded-xl border border-line bg-paper-sunk p-4 text-[1.0625rem] leading-snug font-semibold">
              <span className="mb-2 block font-mono text-xs font-normal text-primary">0{i + 1}</span>
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
          <Card label="Rule" title={block.label} bodyClassName="p-5">
            <p className="overflow-x-auto rounded-lg bg-paper-sunk px-4 py-3 font-mono text-[0.95rem] whitespace-nowrap text-ink sm:text-base">
              {block.code}
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              <Inline text={block.note} />
            </p>
          </Card>
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
