'use client';

import { useActionState, useEffect, useRef } from 'react';
import { applyDesignPartner } from '@/app/actions';
import CalEmbed from '@/components/apply/CalEmbed';
import PixelButton from '@/components/ui/PixelButton';
import { apply as copy, CONTACT_EMAIL } from '@/content/paper';
import { track } from '@/lib/analytics';
import { ATTRIBUTION_FIELDS, type ApplyState, type Field } from '@/lib/apply';

const initial: ApplyState = { status: 'idle' };

// WebMCP declarative attributes (Chrome origin trial); other browsers ignore them.
const tool = (attrs: Record<string, string>) => attrs as Record<string, string>;

const FIELD_META: Record<Field, { type?: string; autoComplete?: string; inputMode?: 'url' | 'email' | 'text'; agent: string }> = {
  email: { type: 'email', autoComplete: 'email', inputMode: 'email', agent: 'Work email of the applicant' },
  company: { type: 'text', autoComplete: 'url', inputMode: 'url', agent: 'Company website, for example company.com' },
  role: { type: 'text', autoComplete: 'organization-title', agent: 'Role of the applicant, for example CTO' },
  change: { agent: 'One recent product change that did not have the expected effect' },
  stack: { type: 'text', autoComplete: 'off', agent: 'Main tools: framework, analytics, observability, database, coding agent' },
};

export default function ApplyForm({ titleId }: { titleId: string }) {
  const [state, formAction, pending] = useActionState(applyDesignPartner, initial);
  const started = useRef(false);
  const tracked = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  // attribution lives in the URL and the referrer: write it straight into the hidden fields
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    for (const f of ATTRIBUTION_FIELDS) {
      const input = form.elements.namedItem(f) as HTMLInputElement | null;
      if (!input) continue;
      input.value = f === 'referrer' ? document.referrer : f === 'landing_path' ? window.location.pathname : (params.get(f) ?? '');
    }
  }, [state]);

  useEffect(() => {
    if (state.status === 'invalid') formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  useEffect(() => {
    if (state.status === 'success' && !tracked.current) {
      tracked.current = true;
      track('form_submit_success');
    }
  }, [state.status]);

  if (state.status === 'success') {
    return (
      <div className="grid gap-4 p-5 sm:p-6" tabIndex={-1} ref={(el) => el?.focus()}>
        <p className="text-2xl font-extrabold">{copy.success.title}</p>
        {process.env.NEXT_PUBLIC_CALCOM_LINK && <p className="text-ink-soft">{copy.success.body}</p>}
        <CalEmbed email={state.email} />
      </div>
    );
  }

  const errors = state.status === 'invalid' ? state.errors : {};
  const values = state.status === 'invalid' || state.status === 'error' ? (state.values ?? {}) : {};
  const onFirstFocus = () => {
    if (started.current) return;
    started.current = true;
    track('form_start');
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      aria-labelledby={titleId}
      noValidate
      className="grid gap-5 p-5 sm:p-6"
      onFocus={onFirstFocus}
      {...tool({
        toolname: 'apply_design_partner',
        tooldescription:
          'Apply to become an onpuck design partner (3 months, free, 5 teams). After a person reviews and submits, they pick a time for a 30-minute intro call.',
      })}
    >
      {state.status === 'error' && (
        <p role="alert" className="border-2 border-frustration-ink bg-frustration/10 p-3 text-[0.9375rem]">
          {copy.error.split(CONTACT_EMAIL)[0]}
          <a className="link font-bold" href={`mailto:${CONTACT_EMAIL}?subject=Design%20partner%20application`}>
            {CONTACT_EMAIL}
          </a>
          {copy.error.split(CONTACT_EMAIL)[1]}
        </p>
      )}

      {(Object.keys(copy.fields) as Field[]).map((name) => {
        const f = copy.fields[name];
        const meta = FIELD_META[name];
        const error = errors[name];
        const id = `apply-${name}`;
        const common = {
          id,
          name,
          required: true,
          placeholder: f.placeholder,
          defaultValue: values[name] ?? '',
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? `${id}-error` : undefined,
          className: `w-full border-2 bg-paper-raised px-3 py-2.5 text-base placeholder:text-ink-faint focus:bg-white ${error ? 'border-frustration-ink' : 'border-ink'}`,
          ...tool({ toolparamdescription: meta.agent }),
        };
        return (
          <div key={name} className="grid gap-1.5">
            <label htmlFor={id} className="font-bold">
              {f.label}
            </label>
            {name === 'change' ? (
              <textarea {...common} rows={3} maxLength={2000} className={`${common.className} resize-y`} />
            ) : (
              <input {...common} type={meta.type} autoComplete={meta.autoComplete} inputMode={meta.inputMode} />
            )}
            {error && (
              <p id={`${id}-error`} className="text-[0.9375rem] font-semibold text-frustration-ink">
                {error}
              </p>
            )}
          </div>
        );
      })}

      {ATTRIBUTION_FIELDS.map((f) => (
        <input key={f} type="hidden" name={f} defaultValue="" />
      ))}
      <input type="hidden" name="agent_invoked" value="0" />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="apply-website">Website</label>
        <input id="apply-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <PixelButton type="submit" disabled={pending} event="cta_click">
          {copy.submit}
        </PixelButton>
        {pending && (
          <span className="font-pixel text-[0.6875rem]" role="status">
            {copy.submitting}
          </span>
        )}
      </div>
    </form>
  );
}
