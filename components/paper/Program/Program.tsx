import PixelButton from '@/components/ui/PixelButton';
import PixelIcon from '@/components/ui/PixelIcon';
import { CTA_LABEL, program } from '@/content/paper';

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-pixel text-[0.75rem]">{title}</h3>
      <ul className="mt-3 grid gap-2.5">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1.25rem_1fr] gap-2">
            <span className="mt-1.5 size-2.5 border-2 border-ink bg-glow" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Program() {
  return (
    <div className="grid gap-10">
      <dl className="grid grid-cols-2 border-2 border-ink bg-paper-raised md:grid-cols-4 lg:-mx-16 xl:-mx-24">
        {program.terms.map((t, i) => (
          <div key={t.label} className={`p-4 ${i % 2 ? 'border-l-2 border-ink' : ''} ${i >= 2 ? 'max-md:border-t-2 max-md:border-ink md:border-l-2' : ''}`}>
            <dt className="font-pixel text-[0.625rem] text-ink-soft">{t.label}</dt>
            <dd className="mt-1 text-lg leading-snug font-bold">{t.value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-10 md:grid-cols-2">
        <List title="What you get" items={program.get} />
        <List title="What we ask" items={program.give} />
      </div>
      <div className="border-t-2 border-ink pt-6">
        <h3 className="font-pixel text-[0.75rem]">A good fit if</h3>
        <ul className="mt-3 grid gap-2.5">
          {program.fit.map((f) => (
            <li key={f} className="grid grid-cols-[1.5rem_1fr] items-start gap-2">
              <span className="mt-1">
                <PixelIcon name="check" size={2} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <PixelButton href="#apply" event="cta_click">
          {CTA_LABEL}
        </PixelButton>
      </div>
    </div>
  );
}
