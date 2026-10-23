import Badge from '@/components/ui/Badge';
import StateMeter from '@/components/ui/StateMeter';
import type { AgentCard } from '@/lib/scene/sim';

const RISK = { low: 'hit', medium: 'partial', high: 'miss' } as const;

/** The inner state of one simulated person, in the simulator's own vocabulary. */
export default function StateCard({ card }: { card: AgentCard }) {
  return (
    <div className="rounded-xl border border-line bg-white p-3.5 text-left text-ink shadow-[var(--shadow-float)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm">{card.label}</p>
        <Badge tone={RISK[card.risk]}>{`Risk ${card.risk}`}</Badge>
      </div>
      <p className="mt-1 text-sm leading-snug text-ink-soft">
        <span className="capitalize text-ink">{card.device}</span> · {card.task}
      </p>
      {card.firstAction && <p className="mt-1 text-sm text-primary">First action: {card.firstAction === 'writing' ? 'writing' : 'stars'}</p>}
      <div className="mt-2.5 grid gap-1.5">
        <StateMeter kind="frustration" value={card.R} compact />
        <StateMeter kind="fatigue" value={card.F} compact />
        <StateMeter kind="motivation" value={card.M} compact />
      </div>
    </div>
  );
}
