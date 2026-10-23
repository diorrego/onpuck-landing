import ReferencesDisclosure from '@/components/paper/ReferencesDisclosure';
import { references } from '@/content/references';

const linkLabel = (r: (typeof references)[number]) =>
  r.arxiv ? `arXiv:${r.arxiv}` : r.doi ? `doi:${r.doi}` : new URL(r.url).hostname.replace(/^www\./, '');

export default function References() {
  return (
    <section id="references" aria-labelledby="references-title" className="scroll-mt-20 border-t border-line pt-12 pb-16 md:pt-16">
      <h2 id="references-title" className="text-[1.875rem] leading-[1.2] font-normal sm:text-[2.25rem]">
        <a href="#references" className="no-underline">
          References
        </a>
      </h2>
      <p className="mt-4 text-lg text-ink-soft">Every claim on this page links to one of these papers or to our experiments.</p>
      <div className="mt-6">
        <ReferencesDisclosure count={references.length}>
          <ol className="grid gap-x-10 text-[0.9375rem] leading-snug lg:-mx-16 lg:grid-cols-2 xl:-mx-24">
            {references.map((r) => (
              <li key={r.id} id={`ref-${r.id}`} className="grid scroll-mt-24 grid-cols-[2.25rem_1fr] gap-x-2 border-t border-line py-3 target:bg-primary-soft">
                <span className="font-mono text-xs leading-6 text-ink-faint">[{r.id}]</span>
                <span>
                  <span className="text-ink-soft">{r.authors}</span> <cite className="font-semibold text-ink not-italic">{r.title}</cite>.{' '}
                  <span className="text-ink-faint">
                    {r.venue}, {r.year}.
                  </span>{' '}
                  <a href={r.url} className="link text-xs [overflow-wrap:anywhere]" rel="noopener">
                    {linkLabel(r)}
                  </a>
                  <span className="mt-1 block text-sm text-ink-soft">{r.finding}</span>
                </span>
              </li>
            ))}
          </ol>
        </ReferencesDisclosure>
      </div>
    </section>
  );
}
