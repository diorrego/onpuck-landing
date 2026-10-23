// onpuck's own experiments, woku as the lab (onpuck/research, exp-01 to exp-04).
// Misses stay in. Numbers are woku review-app QR mobile unless stated.

export type ExperimentOutcome = 'hit' | 'partial' | 'miss' | 'pending';

export type Experiment = {
  id: string;
  name: string;
  question: string;
  n: string;
  predicted: string;
  real: string;
  verdict: string;
  outcome: ExperimentOutcome;
  outcomeLabel: string;
};

export const experiments: Experiment[] = [
  {
    id: 'exp-01',
    name: 'Backtest',
    question: 'Can a simulated user predict how submissions changed between two past versions of woku?',
    n: '560 simulated vs 1,499 real sessions',
    predicted: 'Δ +0.028 [−0.016, +0.072]',
    real: 'Δ −0.022 [−0.084, +0.040]',
    verdict: 'Inside the real interval; the generic prior was not. But "nothing changes" was too, and the model missed real abandonment.',
    outcome: 'partial',
    outcomeLabel: 'Partial',
  },
  {
    id: 'exp-02',
    name: 'Recalibration',
    question: 'Recalibrated on real sessions, does it reproduce abandonment out of sample?',
    n: '280 simulated sessions',
    predicted: 'Abandonment after starting 0.24; Δ +0.061',
    real: 'Abandonment after starting 0.20; Δ −0.022 [−0.084, +0.040]',
    verdict: 'Abandonment reproduced; the Δ missed. A simulated user found a real bug: tapping a tab submitted the form. Fixed in production.',
    outcome: 'miss',
    outcomeLabel: 'Miss on Δ, bug found',
  },
  {
    id: 'exp-03',
    name: 'Variance',
    question: 'Same model, better estimator: was the exp-02 miss just noise?',
    n: '120 paired simulated sessions',
    predicted: 'Δ −0.011 [−0.046, +0.025]',
    real: 'Δ −0.022 [−0.084, +0.040]',
    verdict: 'Yes. Inside the real interval, 62% narrower, and it excludes the generic prior. It can’t yet beat "nothing changes".',
    outcome: 'hit',
    outcomeLabel: 'Hit',
  },
  {
    id: 'exp-04',
    name: 'Blind prediction',
    question: 'Blind, before a live A/B: what changes when the rating moves after the comment?',
    n: '540 simulated; up to 600 real sessions per arm',
    predicted: 'Writing first goes from 7% to 20% (Δ +0.131 [+0.059, +0.202])',
    real: 'Result pending',
    verdict: 'Registered (git tag and SHA-256) before any real data. It can clearly fail, and we will publish it either way.',
    outcome: 'pending',
    outcomeLabel: 'Registered, result pending',
  },
];

// Fig. 4: predicted vs real change in submission rate, same segment, same real interval.
export type IntervalRow = {
  id: string;
  label: string;
  kind: 'real' | 'simulator' | 'baseline';
  point: number;
  low?: number;
  high?: number;
};

export const predictionVsReality: IntervalRow[] = [
  { id: 'real', label: 'Real change', kind: 'real', point: -0.022, low: -0.084, high: 0.04 },
  { id: 'exp-01', label: 'exp-01 simulator', kind: 'simulator', point: 0.028, low: -0.016, high: 0.072 },
  { id: 'exp-02', label: 'exp-02 simulator', kind: 'simulator', point: 0.061, low: -0.018, high: 0.147 },
  { id: 'exp-03', label: 'exp-03 simulator', kind: 'simulator', point: -0.011, low: -0.046, high: 0.025 },
  { id: 'prior', label: 'Generic latency prior', kind: 'baseline', point: 0.062 },
  { id: 'nothing', label: '"Nothing changes"', kind: 'baseline', point: 0 },
];

// Fig. 3: exp-04 registered prediction, QR mobile, among people who start.
export const exp04Arms = {
  control: { label: 'Rating first', firstActionWriting: 0.069, submitRate: 0.506 },
  test: { label: 'Rating after the comment', firstActionWriting: 0.2, submitRate: 0.489 },
} as const;
