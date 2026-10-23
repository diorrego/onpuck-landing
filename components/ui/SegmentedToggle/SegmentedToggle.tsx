'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';

type Option = { value: string; label: string };
type Props = { label: string; value: string; options: Option[]; onChange: (value: string) => void };

/** A segmented control on Base UI ToggleGroup; the selection can never become empty. */
export default function SegmentedToggle({ label, value, options, onChange }: Props) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next) => {
        if (next[0] && next[0] !== value) onChange(next[0]);
      }}
      className="inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1"
    >
      {options.map((o) => (
        <Toggle
          key={o.value}
          value={o.value}
          className="min-h-8 rounded-md px-3 py-1 text-sm font-semibold text-ink-soft hover:text-ink data-pressed:bg-white data-pressed:text-ink data-pressed:shadow-sm"
        >
          {o.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
