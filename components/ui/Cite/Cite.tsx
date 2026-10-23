import { referenceById } from '@/content/references';

type Props = { ids: number[] };

/** In-text citation: [5, 6], each number linking to #ref-N. */
export default function Cite({ ids }: Props) {
  return (
    <sup className="ml-0.5 text-[0.7em] leading-none font-medium whitespace-nowrap text-primary">
      [
      {ids.map((id, i) => {
        const ref = referenceById(id);
        return (
          <span key={id}>
            {i > 0 && ', '}
            <a
              href={`#ref-${id}`}
              className="hover:underline"
              title={`${ref.authors}, ${ref.title}`}
              aria-label={`Reference ${id}: ${ref.authors}`}
              data-event="paper_link_click"
              data-ref={id}
            >
              {id}
            </a>
          </span>
        );
      })}
      ]
    </sup>
  );
}
