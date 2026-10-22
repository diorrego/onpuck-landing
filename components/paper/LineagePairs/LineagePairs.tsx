import Inline from '@/components/ui/Inline';
import StatusChip from '@/components/ui/StatusChip';
import type { Pair } from '@/content/paper';

const STATUS: Record<Pair['status'], string> = {
  prototype: 'In the prototype',
  'by-hand': 'Run by hand',
  designed: 'Designed, not built',
};

export default function LineagePairs({ pairs }: { pairs: Pair[] }) {
  return (
    <div className="lg:-mx-16 xl:-mx-24">
      <div className="hidden grid-cols-2 gap-10 border-b-2 border-ink pb-2 font-pixel text-[0.6875rem] md:grid">
        <span>What the research found</span>
        <span>What we do with it today</span>
      </div>
      <ul>
        {pairs.map((p, i) => (
          <li key={i} className="grid gap-x-10 gap-y-2 border-b-2 border-ink/15 py-5 md:grid-cols-2">
            <p>
              <Inline text={p.paper} />
            </p>
            <div className="flex flex-col items-start gap-2 md:flex-row md:justify-between md:gap-4">
              <p className="font-semibold">
                <span className="mr-2 font-pixel text-[0.625rem] font-normal md:hidden">Today</span>
                <Inline text={p.today} />
              </p>
              <span className="flex-none">
                <StatusChip tone={p.status}>{STATUS[p.status]}</StatusChip>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
