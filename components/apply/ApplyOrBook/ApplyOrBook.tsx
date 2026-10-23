'use client';

import { useId, useState } from 'react';
import ApplyForm, { type ApplyCopy } from '@/components/apply/ApplyForm';
import CalEmbed from '@/components/apply/CalEmbed';
import SegmentedToggle from '@/components/ui/SegmentedToggle';
import { track } from '@/lib/analytics';

type Copy = ApplyCopy & { modes: { label: string; apply: string; book: string }; bookLede: string };
type Props = { copy: Copy; contactEmail: string };

/** The apply card: the application form, or the calendar for people who only want to talk. */
export default function ApplyOrBook({ copy, contactEmail }: Props) {
  const [mode, setMode] = useState<'apply' | 'book'>('apply');
  const titleId = useId();
  return (
    <div data-mode={mode} className="card overflow-hidden data-[mode=book]:lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-6">
        <p id={titleId} className="font-semibold">
          {mode === 'apply' ? 'Design partner application' : copy.modes.book}
        </p>
        <SegmentedToggle
          label={copy.modes.label}
          value={mode}
          options={[
            { value: 'apply', label: copy.modes.apply },
            { value: 'book', label: copy.modes.book },
          ]}
          onChange={(next) => {
            setMode(next as 'apply' | 'book');
            if (next === 'book') track('cta_click', { label: copy.modes.book });
          }}
        />
      </div>
      {mode === 'apply' ? (
        <ApplyForm titleId={titleId} copy={copy} contactEmail={contactEmail} />
      ) : (
        <div className="grid gap-4 p-5 sm:p-7">
          <p className="text-ink-soft">{copy.bookLede}</p>
          <CalEmbed email="" contactEmail={contactEmail} fallback={copy.calendarFallback} />
        </div>
      )}
    </div>
  );
}
