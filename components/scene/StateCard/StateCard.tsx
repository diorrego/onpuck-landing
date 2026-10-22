import StateMeter from '@/components/ui/StateMeter';
import type { AgentCard } from '@/lib/scene/sim';

const RISK: Record<AgentCard['risk'], string> = {
  low: 'text-motivation-ink',
  medium: 'text-fatigue-ink',
  high: 'text-frustration-ink',
};

/** The inner state of one simulated person, in the simulator's own vocabulary. */
export default function StateCard({ card }: { card: AgentCard }) {
  return (
    <div className="pixel-window text-left text-ink shadow-[3px_3px_0_var(--color-ink)]">
      <div className="pixel-titlebar h-6">
        <span className="pixel-close size-3" aria-hidden="true" />
        <span className="pixel-title text-[0.625rem]">{card.label}</span>
      </div>
      <div className="grid gap-1.5 p-2.5">
        <p className="text-[0.8125rem] leading-snug">
          <span className="font-bold capitalize">{card.device}</span> · {card.task}
        </p>
        {card.firstAction && (
          <p className="font-pixel text-[0.625rem]">First action: {card.firstAction === 'writing' ? 'writing' : 'stars'}</p>
        )}
        <StateMeter kind="frustration" value={card.R} compact />
        <StateMeter kind="fatigue" value={card.F} compact />
        <StateMeter kind="motivation" value={card.M} compact />
        <p className="font-pixel text-[0.625rem]">
          Risk of leaving: <span className={RISK[card.risk]}>{card.risk}</span>
        </p>
      </div>
    </div>
  );
}
