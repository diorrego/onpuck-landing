import Disclosure from '@/components/ui/Disclosure';
import { paper } from '@/content/paper';

/** Table of contents: a sticky rail on wide screens, a collapsible list on small ones. */
export default function Contents() {
  const items = [...paper.sections.map((s) => ({ id: s.id, number: s.number, title: s.short ?? s.title })), { id: 'references', number: undefined, title: 'References' }];
  const list = (
    <ol className="grid gap-0.5 text-sm">
      {items.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="grid grid-cols-[1.5rem_1fr] gap-1 rounded-md px-2 py-1.5 text-ink-soft no-underline hover:bg-muted hover:text-ink aria-[current=location]:bg-primary-soft aria-[current=location]:font-semibold aria-[current=location]:text-primary"
            data-toc={s.id}
          >
            <span className="font-mono text-xs leading-5 opacity-60">{s.number ?? ''}</span>
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
          <p className="mb-2 px-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">Contents</p>
          {list}
        </div>
      </nav>
      <Disclosure title="Contents" className="mb-2 xl:hidden">
        <nav aria-label="Contents" className="mt-2 rounded-xl border border-line bg-white p-2">
          {list}
        </nav>
      </Disclosure>
    </>
  );
}
