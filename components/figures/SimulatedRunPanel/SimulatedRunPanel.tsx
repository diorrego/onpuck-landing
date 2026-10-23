'use client';

import { useState } from 'react';
import SceneIsland from '@/components/scene/SceneIsland';
import SegmentedToggle from '@/components/ui/SegmentedToggle';
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
    <SegmentedToggle
      label={copy.armsLabel}
      value={arm}
      options={ARMS.map((a) => ({ value: a, label: exp04Arms[a].label }))}
      onChange={(next) => {
        setArm(next as Arm);
        setTally({ started: 0, writingFirst: 0, submitted: 0 });
      }}
    />
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="border-b border-line p-3 lg:hidden">{toggle}</div>
      <div className="min-w-0 bg-paper-sunk lg:border-r lg:border-line">
        <SceneIsland mode="ab" arm={arm} onTally={setTally} label={copy.sceneLabel} maxVh={0.5} />
      </div>
      <div className="grid min-w-0 content-start gap-5 p-4">
        <div className="max-lg:hidden">{toggle}</div>
        <div>
          <p className="text-sm text-primary">{copy.prediction}</p>
          <p className="mt-1 text-sm text-ink-soft">{copy.predictionNote}</p>
          <ul className="mt-3 grid gap-2">
            {ARMS.map((a) => {
              const v = exp04Arms[a].firstActionWriting;
              return (
                <li key={a} className={`grid gap-1 ${arm === a ? '' : 'opacity-60'}`}>
                  <span className="flex justify-between text-sm">
                    <span className={arm === a ? 'font-bold' : ''}>{exp04Arms[a].label}</span>
                    <span className="tabular-nums">{pct(v)}</span>
                  </span>
                  <span className="block h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <span className="block h-full rounded-full bg-primary" style={{ width: pct(v) }} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div aria-live="off">
          <p className="text-sm text-primary">{copy.replay}</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm tabular-nums">
            <dt>{tally.started}</dt>
            <dd className="text-ink-soft">{copy.started}</dd>
            <dt>{tally.started ? pct(tally.writingFirst / tally.started) : '–'}</dt>
            <dd className="text-ink-soft">{copy.wroteFirst}</dd>
            <dt>{tally.submitted}</dt>
            <dd className="text-ink-soft">{copy.submitted}</dd>
          </dl>
        </div>
        <p className="border-t border-line pt-3 text-sm text-ink-soft">{copy.pending}</p>
      </div>
    </div>
  );
}
