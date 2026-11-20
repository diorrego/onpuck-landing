// onpuck's own experiments, woku as the lab (onpuck/research, exp-01 to exp-05).
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
  /** Registered before any real data (git tag), then scored against a live A/B. */
  blind?: boolean;
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
    n: '540 simulated vs 1,234 real sessions',
    predicted: 'Writing first goes from 7% to 20% (Δ +0.131 [+0.059, +0.202])',
    real: 'Writing first went from 14% to 26% (Δ +0.116 [+0.052, +0.179])',
    verdict: 'Inside the real interval, which excludes zero. Most people still rated first, so "follow the page order" was wrong. Submissions did not change detectably. Levels were off.',
    outcome: 'hit',
    outcomeLabel: 'Hit',
    blind: true,
  },
  {
    id: 'exp-04b',
    name: 'Replication',
    question: 'Same model, rerun five times: does the exp-04 prediction hold?',
    n: '5 runs of 150 paired simulated sessions',
    predicted: 'Δ +0.081 on average (runs from +0.041 to +0.118)',
    real: 'Δ +0.116 [+0.052, +0.179] (the exp-04 A/B)',
    verdict: 'Inside the real interval in 4 of 5 runs. The original run was at the high end. We now register the average of at least five runs.',
    outcome: 'hit',
    outcomeLabel: 'Held in 4 of 5',
  },
  {
    id: 'exp-05',
    name: 'Blind levels',
    question: 'Blind, on the following weeks: can a recalibrated simulator also predict the levels, not just the change?',
    n: '600 simulated vs 744 real sessions',
    predicted: 'Start 49%, submit 38%; writing first Δ +0.093',
    real: 'Start 55% to 61%, submit 42% to 49%; Δ +0.020 [−0.047, +0.088]',
    verdict: 'Miss: 2 of 6 levels inside the real interval. Levels moved with the traffic mix, events against QR codes left in place, and the real change shrank too.',
    outcome: 'miss',
    outcomeLabel: 'Miss',
    blind: true,
  },
];

// Fig. 4: predicted vs real change in submission rate, QR mobile. One group per real comparison,
// each scored against its own real interval: the P0 to P2 backtest and the exp-04 live A/B.
// The exp-04b row is the range of five reruns (research/exp-04b-replica), not a 95% interval.
export type IntervalRow = {
  id: string;
  label: string;
  kind: 'real' | 'simulator' | 'baseline';
  point: number;
  low?: number;
  high?: number;
};

export type IntervalGroup = {
  id: string;
  title: string;
  rows: IntervalRow[];
};

export const predictionVsReality: IntervalGroup[] = [
  {
    id: 'backtest',
    title: 'Backtest: two past versions of woku',
    rows: [
      { id: 'real', label: 'Real change', kind: 'real', point: -0.022, low: -0.084, high: 0.04 },
      { id: 'exp-01', label: 'exp-01 simulator', kind: 'simulator', point: 0.028, low: -0.016, high: 0.072 },
      { id: 'exp-02', label: 'exp-02 simulator', kind: 'simulator', point: 0.061, low: -0.018, high: 0.147 },
      { id: 'exp-03', label: 'exp-03 simulator', kind: 'simulator', point: -0.011, low: -0.046, high: 0.025 },
      { id: 'prior', label: 'Generic latency prior', kind: 'baseline', point: 0.062 },
      { id: 'nothing', label: '"Nothing changes"', kind: 'baseline', point: 0 },
    ],
  },
  {
    id: 'exp-04',
    title: 'Blind prediction: live A/B, rating after the comment',
    rows: [
      { id: 'real', label: 'Real change', kind: 'real', point: -0.02, low: -0.074, high: 0.035 },
      { id: 'exp-04', label: 'exp-04 simulator', kind: 'simulator', point: -0.017, low: -0.031, high: -0.002 },
      { id: 'exp-04b', label: 'exp-04b, range of 5 reruns', kind: 'simulator', point: 0.001, low: -0.012, high: 0.017 },
      { id: 'nothing', label: '"Nothing changes"', kind: 'baseline', point: 0 },
    ],
  },
];

// Fig. 3: exp-04 registered prediction and the real A/B, QR mobile, among people who start.
export const exp04Arms = {
  control: { label: 'Rating first', firstActionWriting: 0.069, realFirstActionWriting: 0.144, submitRate: 0.506 },
  test: { label: 'Rating after the comment', firstActionWriting: 0.2, realFirstActionWriting: 0.259, submitRate: 0.489 },
} as const;
