import Logo from '@/components/ui/Logo';
import PixelButton from '@/components/ui/PixelButton';
import { CTA_LABEL, paper } from '@/content/paper';

const links = paper.sections.filter((s) => s.nav && s.id !== 'abstract');

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur-[2px]">
      <a href="#main" className="sr-only-focusable absolute top-2 left-2 z-50 bg-glow px-3 py-2 font-bold">
        Skip to the paper
      </a>
      <div className="mx-auto flex h-16 max-w-[80rem] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 text-ink no-underline" aria-label="onpuck, back to top">
          <Logo size={30} decorative />
          <span className="text-[1.35rem] leading-none font-extrabold tracking-[-0.03em]">onpuck</span>
        </a>
        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1 text-[0.9375rem] font-semibold">
            {links.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="px-2.5 py-2 no-underline hover:bg-glow">
                  {s.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <PixelButton href="#apply" size="sm" event="cta_click" className="ml-auto md:ml-2" ariaLabel={CTA_LABEL}>
          <span className="sm:hidden" aria-hidden="true">Apply</span>
          <span className="max-sm:hidden" aria-hidden="true">{CTA_LABEL}</span>
        </PixelButton>
      </div>
    </header>
  );
}
