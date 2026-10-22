import type { ReactNode } from 'react';

export type Tone = 'hit' | 'partial' | 'miss' | 'pending' | 'prototype' | 'by-hand' | 'designed' | 'neutral';

const TONES: Record<Tone, string> = {
  hit: 'bg-motivation/20 text-motivation-ink border-motivation-ink',
  partial: 'bg-fatigue/25 text-fatigue-ink border-fatigue-ink',
  miss: 'bg-frustration/15 text-frustration-ink border-frustration-ink',
  pending: 'bg-glow/60 text-ink border-ink',
  prototype: 'bg-glow/60 text-ink border-ink',
  'by-hand': 'bg-paper-sunk text-ink border-ink',
  designed: 'bg-paper-raised text-ink-soft border-ink-soft border-dashed',
  neutral: 'bg-paper-raised text-ink border-ink',
};

/** Small status label in the pixel grammar. */
export default function StatusChip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      data-tone={tone}
      className={`inline-block border-2 px-1.5 pt-[0.2rem] pb-[0.25rem] font-pixel text-[0.625rem] leading-[1.15] ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
