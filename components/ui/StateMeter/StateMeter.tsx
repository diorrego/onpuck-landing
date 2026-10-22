type Kind = 'frustration' | 'fatigue' | 'motivation';

const LABELS: Record<Kind, string> = {
  frustration: 'Frustration R',
  fatigue: 'Fatigue F',
  motivation: 'Motivation M',
};

const FILL: Record<Kind, string> = {
  frustration: 'bg-frustration',
  fatigue: 'bg-fatigue',
  motivation: 'bg-motivation',
};

type Props = { kind: Kind; value: number; compact?: boolean };

/** A state value as a stepped pixel bar: ten cells, filled in the state's data colour. */
export default function StateMeter({ kind, value, compact = false }: Props) {
  const v = Math.round(Math.min(1, Math.max(0, value)) * 100) / 100;
  const cells = Math.round(v * 10);
  const label = LABELS[kind];
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
      <span className={`font-pixel ${compact ? 'text-[0.625rem]' : 'text-[0.6875rem]'} leading-none`}>{label}</span>
      <span
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={v}
        className="flex h-2.5 gap-px border-2 border-ink bg-paper-raised p-px"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`h-full flex-1 ${i < cells ? FILL[kind] : ''}`} />
        ))}
      </span>
      <span className="font-mono text-xs tabular-nums">{v.toFixed(2)}</span>
    </div>
  );
}
