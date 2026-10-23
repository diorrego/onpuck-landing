import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { CTA_LABEL, navLinks } from '@/content/site';

type Props = {
  /** "" on the paper (in-page anchors); "/" on other routes, so every link leads back to it. */
  base?: '' | '/';
};

export default function SiteNav({ base = '' }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <a href="#main" className="sr-only-focusable absolute top-2 left-2 z-50 rounded-md bg-primary px-3 py-2 font-semibold text-white">
        Skip to the paper
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-[80rem] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a
          href={base || '#top'}
          className="flex items-center gap-2 text-ink no-underline"
          aria-label={base ? 'OnPuck, back to the light paper' : 'OnPuck, back to top'}
        >
          <Logo size={42} decorative />
          <span className="text-[1.6rem] leading-none font-bold">OnPuck</span>
        </a>
        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1 text-[0.9375rem]">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`${base}#${l.id}`} className="rounded-md px-3 py-2 text-ink-soft no-underline hover:bg-muted hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button href={`${base}#apply`} size="sm" event="cta_click" className="ml-auto md:ml-2" ariaLabel={CTA_LABEL}>
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
