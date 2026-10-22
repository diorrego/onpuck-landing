import type { ReactNode } from 'react';
import PixelWindow from '@/components/ui/PixelWindow';
import Inline from '@/components/ui/Inline';
import { figureMeta, type FigureId } from '@/content/paper';

type Props = { id: FigureId; children: ReactNode; wide?: boolean; actions?: ReactNode; bodyClassName?: string };

/** A numbered paper figure: a pixel window with its title, and the caption below it. */
export default function Figure({ id, children, wide = true, actions, bodyClassName = 'p-4 sm:p-6' }: Props) {
  const meta = figureMeta(id);
  return (
    <figure id={`fig-${meta.number}`} className={`my-12 ${wide ? 'lg:-mx-16 xl:-mx-24' : ''}`}>
      <PixelWindow title={`Fig. ${meta.number}  ${meta.title}`} actions={actions} bodyClassName={bodyClassName}>
        {children}
      </PixelWindow>
      <figcaption className="mt-4 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-soft">
        <span className="font-bold text-ink">Fig. {meta.number}.</span> <Inline text={meta.caption} />
      </figcaption>
    </figure>
  );
}
