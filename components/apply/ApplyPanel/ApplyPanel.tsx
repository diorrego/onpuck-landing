import ApplyForm from '@/components/apply/ApplyForm';
import PixelIcon from '@/components/ui/PixelIcon';
import PixelWindow from '@/components/ui/PixelWindow';
import { apply, CONTACT_EMAIL } from '@/content/paper';

export default function ApplyPanel() {
  return (
    <div className="grid items-start gap-10 lg:-mx-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:-mx-24">
      <PixelWindow title="Design partner application" titleId="apply-form-title">
        <ApplyForm titleId="apply-form-title" copy={apply} contactEmail={CONTACT_EMAIL} />
      </PixelWindow>
      <aside aria-label="Access and data" className="grid gap-4 lg:pt-2">
        <h3 className="font-pixel text-[0.75rem]">Access and data</h3>
        <ul className="grid gap-3">
          {apply.security.map((s) => (
            <li key={s} className="grid grid-cols-[1.5rem_1fr] items-start gap-2">
              <span className="mt-1">
                <PixelIcon name="check" size={2} />
              </span>
              {s}
            </li>
          ))}
        </ul>
        <p className="text-[0.9375rem] text-ink-soft">
          More in the <a href="#faq-1" className="link">questions</a> below.
        </p>
      </aside>
    </div>
  );
}
