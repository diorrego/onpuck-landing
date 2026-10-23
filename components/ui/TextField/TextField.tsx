import type { InputHTMLAttributes } from 'react';
import { Field } from '@base-ui/react/field';

type Props = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  multiline?: boolean;
  maxLength?: number;
  /** Extra attributes for the control, for example WebMCP's `toolparamdescription`. */
  inputProps?: Record<string, string>;
};

const control =
  'w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base text-ink shadow-xs placeholder:text-ink-faint focus:border-primary focus:ring-3 focus:ring-primary/15 focus:outline-none data-invalid:border-frustration-ink data-invalid:focus:ring-frustration/15';

/** A labelled text control on Base UI Field: label, control, and the error Form passes down. */
export default function TextField({ name, label, type = 'text', autoComplete, inputMode, placeholder, defaultValue, required, multiline, maxLength, inputProps }: Props) {
  return (
    <Field.Root name={name} className="grid gap-1.5">
      <Field.Label className="text-sm font-semibold text-ink">{label}</Field.Label>
      <Field.Control
        type={multiline ? undefined : type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={defaultValue}
        // aria-required, not required: the server validates in English; native bubbles would
        // speak the browser's language
        aria-required={required || undefined}
        maxLength={maxLength}
        render={multiline ? <textarea rows={3} className={`${control} resize-y`} /> : undefined}
        className={multiline ? undefined : control}
        {...inputProps}
      />
      <Field.Error className="text-sm font-medium text-frustration-ink" />
    </Field.Root>
  );
}
