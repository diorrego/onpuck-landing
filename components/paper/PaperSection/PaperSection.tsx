import type { ReactNode } from 'react';
import { Link2 } from 'lucide-react';
import Inline from '@/components/ui/Inline';

type Props = { id: string; number?: string; title: string; lede?: string; children: ReactNode; ledeLarge?: boolean };

/** A paper section: stable anchor, self-linking h2, a lede that states the section's claim. */
export default function PaperSection({ id, number, title, lede, children, ledeLarge = false }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t border-line pt-12 pb-16 first:border-t-0 md:pt-16 md:pb-20">
      <h2 id={`${id}-title`} className="text-[1.875rem] leading-[1.2] font-normal sm:text-[2.25rem]">
        <a href={`#${id}`} className="group no-underline">
          {number && <span className="mr-4 text-ink-faint">{number}</span>}
          {title}
          <Link2 aria-hidden="true" className="ml-2 inline size-5 align-middle text-ink-faint opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
        </a>
      </h2>
      {lede && (
        <p className={`prose-paper mt-4 ${ledeLarge ? 'text-xl leading-relaxed text-ink italic sm:text-[1.3rem]' : 'text-xl leading-relaxed text-ink-soft'}`}>
          <Inline text={lede} />
        </p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}
