import type { ReactNode } from 'react';
import Card from '@/components/ui/Card';
import Inline from '@/components/ui/Inline';
import { figureMeta, type FigureId } from '@/content/paper';

type Props = { id: FigureId; children: ReactNode; wide?: boolean; actions?: ReactNode; bodyClassName?: string };

/** A numbered paper figure: a card with its title, and a LaTeX-style caption below it. */
export default function Figure({ id, children, wide = true, actions, bodyClassName = 'p-5 sm:p-6' }: Props) {
  const meta = figureMeta(id);
  return (
    <figure id={`fig-${meta.number}`} className={`my-12 ${wide ? 'lg:-mx-16 xl:-mx-24' : ''}`}>
      <Card label={`Figure ${meta.number}`} title={meta.title} actions={actions} bodyClassName={bodyClassName}>
        {children}
      </Card>
      <figcaption className="mx-auto mt-4 max-w-[64ch] text-center text-[0.9375rem] leading-relaxed text-ink-soft">
        <span className="text-ink">Figure {meta.number}:</span> <Inline text={meta.caption} />
      </figcaption>
    </figure>
  );
}
