import Inline from '@/components/ui/Inline';
import PixelIcon from '@/components/ui/PixelIcon';
import { paper } from '@/content/paper';

export default function Faq() {
  return (
    <div className="grid border-t-2 border-ink">
      {paper.faq.map((f, i) => (
        <details key={f.q} id={`faq-${i + 1}`} className="group border-b-2 border-ink" data-event="faq_open">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-bold hover:bg-glow/40 [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span aria-hidden="true" className="mt-1 grid size-6 flex-none place-items-center border-2 border-ink group-open:bg-ink group-open:text-paper-raised">
              <PixelIcon name="plus" size={2} color="currentColor" className="group-open:hidden" />
              <PixelIcon name="minus" size={2} color="currentColor" className="hidden group-open:block" />
            </span>
          </summary>
          <div className="prose-paper pb-6">
            {f.a.map((p, j) => (
              <p key={j}>
                <Inline text={p} />
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
