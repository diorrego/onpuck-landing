import { Check } from 'lucide-react';
import ApplyOrBook from '@/components/apply/ApplyOrBook';
import { apply, CONTACT_EMAIL } from '@/content/paper';

export default function ApplyPanel() {
  return (
    <div className="grid items-start gap-10 lg:-mx-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:-mx-24">
      <ApplyOrBook copy={apply} contactEmail={CONTACT_EMAIL} />
      <aside aria-label="Access and data" className="grid gap-4 lg:pt-4">
        <h3 className="text-lg">Access and data</h3>
        <ul className="grid gap-2.5">
          {apply.security.map((s) => (
            <li key={s} className="flex gap-2.5 text-ink-soft">
              <Check aria-hidden="true" className="mt-1.5 size-4 flex-none text-primary" />
              {s}
            </li>
          ))}
        </ul>
        <p className="text-sm text-ink-soft">
          More in the <a href="#faq" className="link">questions</a> below.
        </p>
      </aside>
    </div>
  );
}
