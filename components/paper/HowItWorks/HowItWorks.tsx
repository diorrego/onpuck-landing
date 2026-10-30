import { ArrowDown, Check, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { experiments } from '@/content/experiments';
import { CTA_LABEL, overview } from '@/content/paper';
import { references } from '@/content/references';

const o = overview;
const logo = (id: string) => `/logos/${id}.svg`;
const toolName = (id: string) => o.stack.find((s) => s.id === id)!.name;

function Mark({ id, size }: { id: string; size: number }) {
  // SVG marks need no optimisation; next/image would only add a wrapper.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={logo(id)} alt="" width={size} height={size} loading="lazy" decoding="async" className="object-contain" style={{ width: size, height: size }} />;
}

/** Step 1: the stack connected, read-only. */
function Connections() {
  return (
    <div className="w-full max-w-[19rem] divide-y divide-muted rounded-xl border border-line bg-paper p-1.5 text-sm shadow-[0_8px_30px_rgb(29_78_216/0.1)]">
      {o.connections.tools.map((id) => (
        <div key={id} className="flex items-center gap-2.5 px-2.5 py-2">
          <Mark id={id} size={20} />
          <span className="flex-1 text-ink">{toolName(id)}</span>
          <span className="rounded-full bg-motivation/12 px-2 py-0.5 font-mono text-[0.6875rem] text-motivation-ink">{o.connections.access}</span>
        </div>
      ))}
    </div>
  );
}

/** Step 2: what the user said, and what the system recorded. */
function Story() {
  const s = o.story;
  return (
    <div className="grid w-full max-w-[19rem] gap-2.5">
      <p className="max-w-[88%] justify-self-start rounded-[14px_14px_14px_4px] border border-line bg-paper px-3.5 py-2.5 text-[0.9375rem] leading-snug shadow-card">
        <span className="mb-0.5 block text-xs text-ink-faint">{s.speaker}</span>
        {s.lead}
        <span className="shadow-[inset_0_-2px_0_var(--color-frustration)]">{s.claim}</span>
        {s.tail}
      </p>
      <p className="max-w-[92%] justify-self-end rounded-xl border border-frustration/30 bg-frustration/10 px-3 py-2.5 font-mono text-xs leading-normal text-ink">
        <span className="mb-0.5 flex items-center gap-1.5 font-serif text-[0.8125rem] font-bold text-frustration-ink">
          <X aria-hidden size={14} strokeWidth={2.5} />
          {s.check}
        </span>
        {s.recorded}
      </p>
    </div>
  );
}

/** Step 3: the coding agent receives the spec. */
function Terminal() {
  return (
    <div className="w-full max-w-[19rem] overflow-hidden rounded-xl bg-[#0f172a] font-mono text-xs leading-[1.7] text-[#e2e8f0] shadow-[0_8px_30px_rgb(29_78_216/0.1)]">
      <div className="flex gap-1.5 border-b border-[#1e293b] px-3 py-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2.5 rounded-full bg-[#334155]" />
        ))}
      </div>
      <div className="px-3.5 pt-2.5 pb-3">
        {o.terminal.map((l, i) => (
          <div key={i} className="truncate">
            {'prompt' in l && <span className="text-[#94a3b8]">{l.prompt} </span>}
            {'tag' in l && <span className="text-[#93c5fd]">{l.tag} </span>}
            {'text' in l && <span className={'prompt' in l || 'tag' in l ? '' : 'text-[#94a3b8]'}>{l.text}</span>}
            {'done' in l && <span className="text-[#86efac]">{l.done}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const visuals = [Connections, Story, Terminal];

/** The pitch between the title page and the paper: hook, three steps, what changes, the tools,
 *  and a bridge that sells the paper as the proof. */
export default function HowItWorks() {
  const pending = experiments.filter((e) => e.outcome === 'pending').length;
  const proof = [
    { n: references.length, label: o.bridge.proof.references },
    { n: experiments.length, label: o.bridge.proof.experiments },
    { n: pending, label: o.bridge.proof.pending },
  ];
  return (
    <section id={o.id} aria-labelledby={`${o.id}-title`} className="border-b border-line bg-paper-sunk">
      <div className="mx-auto grid max-w-[80rem] gap-20 px-4 py-20 sm:px-6 md:gap-24 md:py-24 lg:px-8">
        <header className="grid justify-items-center gap-5 text-center">
          <h2 id={`${o.id}-title`} className="text-sm font-bold tracking-[0.14em] text-primary uppercase">
            {o.title}
          </h2>
          <p className="max-w-[20ch] text-[clamp(2.25rem,1.5rem+2.6vw,3.5rem)] leading-[1.1] text-balance">
            {o.hook.lead} <span className="text-primary">{o.hook.emphasis}</span> {o.hook.tail}
          </p>
          <p className="max-w-[42ch] text-lg text-balance text-ink-soft sm:text-xl">{o.subline}</p>
        </header>

        <ol className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {o.steps.map((s, i) => {
            const Visual = visuals[i];
            return (
              <li key={s.title} className="card flex min-w-0 flex-col overflow-hidden rounded-[1.25rem]">
                <div aria-hidden className="grid h-54 place-items-center border-b border-line bg-linear-to-b from-primary-soft to-paper p-6">
                  <Visual />
                </div>
                <div className="grid gap-1.5 px-6 pt-5 pb-6">
                  <span className="text-sm font-bold text-primary">{i + 1}</span>
                  <h3 className="text-2xl leading-tight">{s.title}</h3>
                  <p className="text-[1.0625rem] leading-normal text-ink-soft">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="grid justify-items-center gap-7">
          <h3 className="text-center text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-tight">{o.compare.title}</h3>
          <div className="card w-full max-w-[56rem] overflow-hidden rounded-[1.25rem]">
            <table className="w-full table-fixed border-collapse text-left text-[0.9375rem] leading-snug sm:text-[1.0625rem]">
              <thead>
                <tr className="text-xs font-bold tracking-[0.05em] uppercase sm:text-[0.8125rem]">
                  <th scope="col" className="bg-paper-sunk px-3.5 py-3.5 text-ink-faint sm:px-6">{o.compare.before}</th>
                  <th scope="col" className="bg-primary-soft px-3.5 py-3.5 text-primary sm:px-6">{o.compare.after}</th>
                </tr>
              </thead>
              <tbody>
                {o.compare.rows.map(([before, after]) => (
                  <tr key={after} className="border-t border-line">
                    <td className="bg-paper-sunk px-3.5 py-4 align-top text-ink-faint sm:px-6">
                      <span className="flex gap-3">
                        <X aria-hidden size={18} className="mt-0.5 shrink-0" />
                        {before}
                      </span>
                    </td>
                    <td className="px-3.5 py-4 align-top text-ink sm:px-6">
                      <span className="flex gap-3">
                        <Check aria-hidden size={18} strokeWidth={2.5} className="mt-0.5 shrink-0 text-primary" />
                        {after}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid justify-items-center gap-4">
          <p className="text-[0.9375rem] text-ink-faint">{o.stackLabel}</p>
          <ul className="flex max-w-[60rem] flex-wrap justify-center gap-2.5">
            {o.stack.map((s) => (
              <li key={s.id} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper py-2 pr-4 pl-3 text-base shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
                <Mark id={s.id} size={22} />
                {s.name}
              </li>
            ))}
          </ul>
        </div>

        <aside aria-labelledby={`${o.id}-bridge`} className="relative grid justify-items-center gap-7 overflow-hidden rounded-3xl bg-primary px-8 py-12 text-center text-white md:px-12 md:py-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_20rem_at_50%_-30%,rgb(255_255_255/0.16),transparent_70%)]" />
          <h3 id={`${o.id}-bridge`} className="relative text-[clamp(2rem,1.4rem+2vw,3rem)] leading-[1.1]">
            {o.bridge.title}
          </h3>
          <p className="relative -mt-3 max-w-[48ch] text-balance text-primary-tint">{o.bridge.body}</p>
          <ul className="relative flex flex-wrap justify-center gap-3">
            {proof.map((p) => (
              <li key={p.label} className="grid min-w-34 justify-items-center gap-0.5 rounded-[14px] bg-white/10 px-4.5 py-3.5 text-sm text-primary-tint ring-1 ring-white/20 ring-inset">
                <span className="text-[2rem] leading-none text-white tabular-nums">{p.n}</span>
                {p.label}
              </li>
            ))}
          </ul>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Button href={o.bridge.cta.href} variant="light" event="paper_link_click">
              {o.bridge.cta.label}
              <ArrowDown aria-hidden size={18} />
            </Button>
            <Button href="#apply" variant="ghost" event="cta_click">
              {CTA_LABEL}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}
