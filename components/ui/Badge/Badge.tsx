import type { ReactNode } from 'react';

export type Tone = 'hit' | 'partial' | 'miss' | 'pending' | 'prototype' | 'by-hand' | 'designed' | 'neutral';

const TONES: Record<Tone, string> = {
  hit: 'bg-motivation/12 text-motivation-ink ring-motivation/30',
  partial: 'bg-fatigue/15 text-fatigue-ink ring-fatigue/35',
  miss: 'bg-frustration/10 text-frustration-ink ring-frustration/30',
  pending: 'bg-primary-soft text-primary ring-primary/20',
  prototype: 'bg-primary-soft text-primary ring-primary/20',
  'by-hand': 'bg-muted text-ink-soft ring-line-strong',
  designed: 'bg-paper text-ink-faint ring-line-strong ring-dashed',
  neutral: 'bg-muted text-ink-soft ring-line-strong',
};

/** Small rounded status pill. */
export default function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      data-tone={tone}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs leading-5 font-semibold ring-1 ring-inset ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
