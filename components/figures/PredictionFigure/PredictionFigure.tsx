import Figure from '@/components/figures/Figure';
import { predictionVsReality } from '@/content/experiments';

const MIN = -0.1;
const MAX = 0.16;
const pct = (v: number) => `${((v - MIN) / (MAX - MIN)) * 100}%`;
const fmt = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(3)}`;
const TICKS = [-0.1, -0.05, 0, 0.05, 0.1, 0.15];

const real = predictionVsReality.find((r) => r.kind === 'real')!;

export default function PredictionFigure() {
  return (
    <Figure id="prediction">
      <div role="table" aria-label="Predicted and real change in review submission rate" className="grid gap-y-3 text-[0.9375rem]">
        <div role="row" className="sr-only">
          <span role="columnheader">Source</span>
          <span role="columnheader">Change [95% interval]</span>
        </div>
        {predictionVsReality.map((row) => {
          const value = row.low !== undefined ? `${fmt(row.point)} [${fmt(row.low)}, ${fmt(row.high!)}]` : fmt(row.point);
          return (
            <div
              role="row"
              key={row.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 md:grid-cols-[11rem_1fr_13rem]"
            >
              <span role="rowheader" className={`${row.kind === 'real' ? 'text-ink' : 'text-ink-soft'}`}>
                {row.label}
              </span>
              <span role="cell" className="text-sm tabular-nums md:order-3">
                {value}
              </span>
              <span aria-hidden="true" className="relative col-span-2 h-6 rounded-md bg-paper-sunk md:order-2 md:col-span-1">
                {/* the real interval, faint on every row so each estimate reads against it */}
                <span className="absolute inset-y-0 bg-line/70" style={{ left: pct(real.low!), right: `calc(100% - ${pct(real.high!)})` }} />
                <span className="absolute inset-y-0 w-px bg-ink-faint" style={{ left: pct(0) }} />
                {row.low !== undefined && (
                  <span
                    className={`absolute top-2 h-2 rounded-full ${row.kind === 'real' ? 'bg-ink-soft' : 'bg-primary'}`}
                    style={{ left: pct(row.low), right: `calc(100% - ${pct(row.high!)})` }}
                  />
                )}
                {row.kind === 'baseline' && row.point !== 0 ? (
                  <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-frustration" style={{ left: pct(row.point) }} />
                ) : row.kind === 'baseline' ? (
                  <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-soft bg-white" style={{ left: pct(row.point) }} />
                ) : (
                  <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow-sm" style={{ left: pct(row.point) }} />
                )}
              </span>
            </div>
          );
        })}
        <div aria-hidden="true" className="grid grid-cols-1 md:grid-cols-[11rem_1fr_13rem] md:gap-x-4">
          <span className="relative col-start-1 h-5 md:col-start-2">
            {TICKS.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 text-xs text-ink-faint tabular-nums" style={{ left: pct(t) }}>
                {t === 0 ? '0' : `${t > 0 ? '+' : '\u2212'}${Math.abs(t).toFixed(2)}`}
              </span>
            ))}
          </span>
        </div>
      </div>
      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-2"><span className="inline-block h-2 w-6 rounded-full bg-ink-soft" /> Real 95% interval</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-2 w-6 rounded-full bg-primary" /> Simulator 95% interval</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block size-3 rotate-45 rounded-[2px] bg-frustration" /> Generic prior</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block size-3 rounded-full border-2 border-ink-soft bg-white" /> &ldquo;Nothing changes&rdquo;</span>
      </p>
    </Figure>
  );
}
