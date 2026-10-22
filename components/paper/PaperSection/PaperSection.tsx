import type { ReactNode } from 'react';
import Inline from '@/components/ui/Inline';

type Props = { id: string; number?: string; title: string; lede?: string; children: ReactNode; ledeLarge?: boolean };

/** A paper section: stable anchor, self-linking h2, a lede that states the section's claim. */
export default function PaperSection({ id, number, title, lede, children, ledeLarge = false }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t-2 border-ink pt-10 pb-16 first:border-t-0 md:pt-14 md:pb-20">
      <h2 id={`${id}-title`} className="text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.375rem]">
        <a href={`#${id}`} className="group no-underline">
          {number && (
            <span className="mr-3 inline-block translate-y-[-0.2em] align-middle font-pixel text-[0.875rem] font-normal tracking-normal text-ink-soft">
              §{number}
            </span>
          )}
          {title}
          <span aria-hidden="true" className="ml-2 font-pixel text-base text-ink-faint opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
            #
          </span>
        </a>
      </h2>
      {lede && (
        <p className={`prose-paper mt-5 ${ledeLarge ? 'text-xl leading-relaxed font-medium sm:text-[1.4rem]' : 'text-lg leading-relaxed text-ink-soft sm:text-xl'}`}>
          <Inline text={lede} />
        </p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}
