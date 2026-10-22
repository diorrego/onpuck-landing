import Inline from '@/components/ui/Inline';
import { paper } from '@/content/paper';

export default function Faq() {
  return (
    <div className="grid border-t-2 border-ink">
      {paper.faq.map((f, i) => (
        <details key={f.q} id={`faq-${i + 1}`} className="group border-b-2 border-ink" data-event="faq_open">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-bold hover:bg-glow/40 [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span aria-hidden="true" className="mt-1 grid size-5 flex-none place-items-center border-2 border-ink font-pixel text-[0.75rem] leading-none group-open:bg-ink group-open:text-paper-raised">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">&minus;</span>
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
