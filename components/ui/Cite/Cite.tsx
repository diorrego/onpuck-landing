import { referenceById } from '@/content/references';

type Props = { ids: number[] };

/** In-text citation: [5, 6], each number linking to #ref-N. */
export default function Cite({ ids }: Props) {
  return (
    <sup className="font-mono text-[0.68em] leading-none whitespace-nowrap">
      [
      {ids.map((id, i) => {
        const ref = referenceById(id);
        return (
          <span key={id}>
            {i > 0 && ', '}
            <a
              href={`#ref-${id}`}
              className="link"
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
