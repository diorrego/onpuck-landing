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
              <span role="rowheader" className={`${row.kind === 'real' ? 'font-bold' : ''}`}>
                {row.label}
              </span>
              <span role="cell" className="font-mono text-xs tabular-nums md:order-3">
                {value}
              </span>
              <span aria-hidden="true" className="relative col-span-2 h-6 border-x-2 border-ink/20 md:order-2 md:col-span-1">
                {/* the real interval, faint on every row so each estimate reads against it */}
                <span className="dither-ink absolute inset-y-0 opacity-15" style={{ left: pct(real.low!), right: `calc(100% - ${pct(real.high!)})` }} />
                <span className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: pct(0) }} />
                {row.low !== undefined && (
                  <span
                    className={`absolute top-1.5 h-3 border-2 border-ink ${row.kind === 'real' ? 'dither-ink bg-paper-raised' : 'bg-glow'}`}
                    style={{ left: pct(row.low), right: `calc(100% - ${pct(row.high!)})` }}
                  />
                )}
                {row.kind === 'baseline' && row.point !== 0 ? (
                  <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-ink bg-frustration" style={{ left: pct(row.point) }} />
                ) : row.kind === 'baseline' ? (
                  <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-paper-raised" style={{ left: pct(row.point) }} />
                ) : (
                  <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 bg-ink" style={{ left: pct(row.point) }} />
                )}
              </span>
            </div>
          );
        })}
        <div aria-hidden="true" className="grid grid-cols-1 md:grid-cols-[11rem_1fr_13rem] md:gap-x-4">
          <span className="relative col-start-1 h-5 md:col-start-2">
            {TICKS.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 font-mono text-[0.6875rem] text-ink-soft" style={{ left: pct(t) }}>
                {t === 0 ? '0' : `${t > 0 ? '+' : '\u2212'}${Math.abs(t).toFixed(2)}`}
              </span>
            ))}
          </span>
        </div>
      </div>
      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-2"><span className="dither-ink inline-block h-3 w-6 border-2 border-ink" /> Real 95% interval</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-6 border-2 border-ink bg-glow" /> Simulator 95% interval</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block size-3 rotate-45 border-2 border-ink bg-frustration" /> Generic prior</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block size-3 border-2 border-ink bg-paper-raised" /> &ldquo;Nothing changes&rdquo;</span>
      </p>
    </Figure>
  );
}
