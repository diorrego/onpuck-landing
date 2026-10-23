import { Meter } from '@base-ui/react/meter';

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

/** A state value on Base UI Meter: label, a rounded bar in the state's data colour, value. */
export default function StateMeter({ kind, value, compact = false }: Props) {
  const v = Math.round(Math.min(1, Math.max(0, value)) * 100) / 100;
  return (
    <Meter.Root
      value={v}
      min={0}
      max={1}
      locale="en-US"
      format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-2.5"
    >
      <Meter.Label className={`${compact ? 'text-xs' : 'text-sm'} text-ink-soft`}>{LABELS[kind]}</Meter.Label>
      <Meter.Track className="block h-1.5 overflow-hidden rounded-full bg-muted">
        <Meter.Indicator className={`block h-full rounded-full ${FILL[kind]}`} />
      </Meter.Track>
      <Meter.Value className="font-mono text-xs tabular-nums text-ink" />
    </Meter.Root>
  );
}
