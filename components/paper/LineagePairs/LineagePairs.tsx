import Badge from '@/components/ui/Badge';
import Inline from '@/components/ui/Inline';
import type { Pair } from '@/content/paper';

const STATUS: Record<Pair['status'], string> = {
  prototype: 'In the prototype',
  'by-hand': 'Run by hand',
  designed: 'Designed, not built',
};

/** Research next to what OnPuck does with it today, in two labelled columns. */
export default function LineagePairs({ pairs }: { pairs: Pair[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line lg:-mx-16 xl:-mx-24">
      {pairs.map((p, i) => (
        <li key={i} className="grid gap-x-12 gap-y-3 py-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-primary">Research</p>
            <p className="mt-1 text-ink">
              <Inline text={p.paper} />
            </p>
          </div>
          <div>
            <p className="flex items-center justify-between gap-3 text-sm font-semibold text-primary">
              In OnPuck today
              <Badge tone={p.status}>{STATUS[p.status]}</Badge>
            </p>
            <p className="mt-1 text-ink-soft">
              <Inline text={p.today} />
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
