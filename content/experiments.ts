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
    question:
      'Does a simulated user predict how the review submission rate changed between two past versions of woku’s review app?',
    n: '560 simulated sessions (140 personas, 2 builds, 2 arms) vs 1,499 real sessions',
    predicted: 'Δ +0.028 [−0.016, +0.072]',
    real: 'Δ −0.022 [−0.084, +0.040]',
    verdict:
      'Inside the real interval, and the generic latency prior (+0.062) was not. But "nothing changes" was inside too, so the backtest could not tell the simulator from the baseline. Real sessions showed composition time and about 27% abandonment after starting, which the model lacked.',
    outcome: 'partial',
    outcomeLabel: 'Partial',
  },
  {
    id: 'exp-02',
    name: 'Recalibration',
    question:
      'Recalibrated on real session behaviour from the first version only, does it reproduce times and abandonment out of sample?',
    n: '280 simulated sessions, same personas and seeds as exp-01',
    predicted: 'Abandonment after starting 0.24; Δ +0.061',
    real: 'Abandonment after starting 0.20; Δ −0.022 [−0.084, +0.040]',
    verdict:
      'Abandonment reproduced out of sample. Time tails too short, and the Δ fell outside the real interval. A simulated user found a real bug: tapping the Write or Audio tab submitted the form. Fixed in production.',
    outcome: 'miss',
    outcomeLabel: 'Miss on Δ, bug found',
  },
  {
    id: 'exp-03',
    name: 'Variance',
    question:
      'Same model, a better estimator (expected-value abandonment, common random numbers): was the exp-02 miss noise?',
    n: '120 paired simulated sessions',
    predicted: 'Δ −0.011 [−0.046, +0.025]',
    real: 'Δ −0.022 [−0.084, +0.040]',
    verdict:
      'Inside the real interval, with an interval 62% narrower that excludes the generic prior. It still cannot rule out "nothing changes", because in this backtest nothing did.',
    outcome: 'hit',
    outcomeLabel: 'Hit',
  },
  {
    id: 'exp-04',
    name: 'Blind prediction',
    question:
      'Before a live A/B on woku: what changes when the star rating moves from before the comment to after it?',
    n: '540 paired simulated sessions; the real A/B runs up to 600 sessions per arm',
    predicted:
      'Writing as the first action goes from 7% to 20% (Δ +0.131 [+0.059, +0.202]); most people still tap the stars first; submissions dip slightly (Δ −0.017)',
    real: 'Result pending',
    verdict:
      'Registered in our research repository (git tag and SHA-256) before any real data existed. The first-action prediction is the one that can clearly fail. We will publish the result either way.',
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
