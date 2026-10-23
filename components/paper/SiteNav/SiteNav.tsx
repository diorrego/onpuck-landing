import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { CTA_LABEL, paper } from '@/content/paper';

const links = paper.sections.filter((s) => s.nav && s.id !== 'abstract');

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <a href="#main" className="sr-only-focusable absolute top-2 left-2 z-50 rounded-md bg-primary px-3 py-2 font-semibold text-white">
        Skip to the paper
      </a>
      <div className="mx-auto flex h-16 max-w-[80rem] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 text-ink no-underline" aria-label="OnPuck, back to top">
          <Logo size={28} decorative />
          <span className="text-xl leading-none font-bold tracking-[-0.02em]">OnPuck</span>
        </a>
        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1 text-[0.9375rem]">
            {links.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="rounded-md px-3 py-2 text-ink-soft no-underline hover:bg-muted hover:text-ink">
                  {s.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button href="#apply" size="sm" event="cta_click" className="ml-auto md:ml-2" ariaLabel={CTA_LABEL}>
          <span className="sm:hidden" aria-hidden="true">
            Apply
          </span>
          <span className="max-sm:hidden" aria-hidden="true">
            {CTA_LABEL}
          </span>
        </Button>
      </div>
    </header>
  );
}
