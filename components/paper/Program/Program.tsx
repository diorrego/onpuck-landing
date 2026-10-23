import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CTA_LABEL, program } from '@/content/paper';

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-bold">{title}</h3>
      <ul className="mt-4 grid gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-ink-soft">
            <Check aria-hidden="true" className="mt-1 size-4 flex-none text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Program() {
  return (
    <div className="grid gap-8">
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:-mx-16 xl:-mx-24">
        {program.terms.map((t) => (
          <div key={t.label} className="rounded-xl border border-line bg-paper-sunk p-4">
            <dt className="text-xs font-semibold tracking-wide text-ink-faint uppercase">{t.label}</dt>
            <dd className="mt-1 text-lg leading-snug font-bold">{t.value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-4 md:grid-cols-2">
        <List title="What you get" items={program.get} />
        <List title="What we ask" items={program.give} />
      </div>
      <div>
        <h3 className="text-lg font-bold">A good fit if</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {program.fit.map((f) => (
            <li key={f} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink-soft">
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Button href="#apply" event="cta_click">
          {CTA_LABEL}
        </Button>
      </div>
    </div>
  );
}
