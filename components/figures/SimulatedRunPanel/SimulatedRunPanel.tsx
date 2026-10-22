'use client';

import { useState } from 'react';
import SceneIsland from '@/components/scene/SceneIsland';
import type { Arm } from '@/lib/scene/sim';

type ArmData = { label: string; firstActionWriting: number };
export type SimulatedRunCopy = {
  armsLabel: string;
  prediction: string;
  predictionNote: string;
  replay: string;
  started: string;
  wroteFirst: string;
  submitted: string;
  pending: string;
  sceneLabel: string;
};
type Props = { copy: SimulatedRunCopy; arms: Record<Arm, ArmData> };

const ARMS: Arm[] = ['control', 'test'];
const pct = (v: number) => `${Math.round(v * 100)}%`;

/** The interactive half of Fig. 3: arm toggle, replay scene, registered prediction, tally. */
export default function SimulatedRunPanel({ copy, arms: exp04Arms }: Props) {
  const [arm, setArm] = useState<Arm>('test');
  const [tally, setTally] = useState({ started: 0, writingFirst: 0, submitted: 0 });

  const toggle = (
    <span role="radiogroup" aria-label={copy.armsLabel} className="flex flex-wrap gap-1.5">
      {ARMS.map((a) => (
        <button
          key={a}
          type="button"
          role="radio"
          aria-checked={arm === a}
          onClick={() => {
            setArm(a);
            setTally({ started: 0, writingFirst: 0, submitted: 0 });
          }}
          className={`min-h-9 border-2 border-ink px-2.5 py-1 text-left text-[0.8125rem] leading-tight font-bold ${arm === a ? 'bg-ink text-paper-raised' : 'bg-paper-raised hover:bg-glow'}`}
        >
          {exp04Arms[a].label}
        </button>
      ))}
    </span>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="border-b-2 border-ink p-3 lg:hidden">{toggle}</div>
      <div className="min-w-0 bg-paper lg:border-r-2 lg:border-ink">
        <SceneIsland mode="ab" arm={arm} onTally={setTally} label={copy.sceneLabel} maxVh={0.5} />
      </div>
      <div className="grid min-w-0 content-start gap-5 p-4">
        <div className="max-lg:hidden">{toggle}</div>
        <div>
          <p className="font-pixel text-[0.6875rem]">{copy.prediction}</p>
          <p className="mt-1 text-sm text-ink-soft">{copy.predictionNote}</p>
          <ul className="mt-3 grid gap-2">
            {ARMS.map((a) => {
              const v = exp04Arms[a].firstActionWriting;
              return (
                <li key={a} className={`grid gap-1 ${arm === a ? '' : 'opacity-60'}`}>
                  <span className="flex justify-between text-sm">
                    <span className={arm === a ? 'font-bold' : ''}>{exp04Arms[a].label}</span>
                    <span className="font-mono tabular-nums">{pct(v)}</span>
                  </span>
                  <span className="block h-3 border-2 border-ink bg-paper-raised" aria-hidden="true">
                    <span className="dither-ink block h-full" style={{ width: pct(v) }} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div aria-live="off">
          <p className="font-pixel text-[0.6875rem]">{copy.replay}</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-sm tabular-nums">
            <dt>{tally.started}</dt>
            <dd className="font-sans">{copy.started}</dd>
            <dt>{tally.started ? pct(tally.writingFirst / tally.started) : '–'}</dt>
            <dd className="font-sans">{copy.wroteFirst}</dd>
            <dt>{tally.submitted}</dt>
            <dd className="font-sans">{copy.submitted}</dd>
          </dl>
        </div>
        <p className="border-t-2 border-ink pt-3 text-sm">{copy.pending}</p>
      </div>
    </div>
  );
}
