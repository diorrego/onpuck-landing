import { references } from '@/content/references';

const linkLabel = (r: (typeof references)[number]) =>
  r.arxiv ? `arXiv:${r.arxiv}` : r.doi ? `doi:${r.doi}` : new URL(r.url).hostname.replace(/^www\./, '');

export default function References() {
  return (
    <section id="references" aria-labelledby="references-title" className="scroll-mt-20 border-t-2 border-ink pt-10 pb-16 md:pt-14">
      <h2 id="references-title" className="text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.375rem]">
        <a href="#references" className="no-underline">
          References
        </a>
      </h2>
      <ol className="mt-8 grid gap-x-12 text-[0.9375rem] leading-snug lg:-mx-16 lg:grid-cols-2 xl:-mx-24">
        {references.map((r) => (
          <li key={r.id} id={`ref-${r.id}`} className="grid scroll-mt-24 grid-cols-[2.25rem_1fr] gap-x-2 border-t-2 border-ink/15 py-3 target:bg-glow/40">
            <span className="font-mono text-xs leading-6 text-ink-soft">[{r.id}]</span>
            <span>
              {r.authors} <cite className="font-semibold not-italic">{r.title}</cite>. {r.venue}, {r.year}.{' '}
              <a href={r.url} className="link font-mono text-xs [overflow-wrap:anywhere]" rel="noopener">
                {linkLabel(r)}
              </a>
              <span className="mt-1 block text-ink-soft">{r.finding}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
