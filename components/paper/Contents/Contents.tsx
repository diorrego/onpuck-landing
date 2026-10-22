import { paper } from '@/content/paper';

/** Table of contents: a sticky rail on wide screens, a collapsed list on small ones. */
export default function Contents() {
  const items = [...paper.sections.map((s) => ({ id: s.id, number: s.number, title: s.title })), { id: 'references', number: undefined, title: 'References' }];
  const list = (
    <ol className="grid gap-0.5 text-[0.9375rem]">
      {items.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="grid grid-cols-[1.75rem_1fr] gap-1 px-2 py-1.5 no-underline hover:bg-glow aria-[current=location]:bg-ink aria-[current=location]:text-paper-raised aria-[current=location]:[&>span:first-child]:text-paper-raised/70" data-toc={s.id}>
            <span className="font-pixel text-[0.625rem] leading-6 text-ink-soft">{s.number ? `§${s.number}` : ''}</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <nav aria-label="Contents" className="hidden xl:block">
        <div className="sticky top-24">
          <p className="mb-3 px-2 font-pixel text-[0.6875rem]">Contents</p>
          {list}
        </div>
      </nav>
      <details className="mb-2 border-2 border-ink bg-paper-raised xl:hidden">
        <summary className="cursor-pointer px-4 py-3 font-pixel text-[0.75rem]">Contents</summary>
        <nav aria-label="Contents" className="border-t-2 border-ink p-2">
          {list}
        </nav>
      </details>
    </>
  );
}
