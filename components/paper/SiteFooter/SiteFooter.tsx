import Logo from '@/components/ui/Logo';
import { CONTACT_EMAIL, PURPOSE_LINE, VERSION, founders } from '@/content/paper';

export default function SiteFooter() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-[80rem] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="grid content-start gap-4">
          <span className="flex items-center gap-2">
            <Logo size={56} decorative />
            <span className="text-[2rem] leading-none font-bold">OnPuck</span>
          </span>
          <p className="max-w-[34ch] text-lg leading-snug text-white/85">{PURPOSE_LINE}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-wide text-white/50 uppercase">Founders</h2>
          <ul className="mt-3 grid gap-3">
            {founders.map((f) => (
              <li key={f.name}>
                <span className="font-semibold">{f.name}</span>
                <span className="block text-sm text-white/70">
                  {f.role}. {f.line}
                </span>
                <a
                  href={f.linkedin}
                  className="mt-1 inline-block text-sm underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  rel="noopener"
                  aria-label={`${f.name} on LinkedIn`}
                >
                  LinkedIn
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-3">
          <h2 className="text-xs font-semibold tracking-wide text-white/50 uppercase">Contact</h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit text-lg font-semibold underline decoration-white/30 underline-offset-4 hover:decoration-white">
            {CONTACT_EMAIL}
          </a>
          <p className="text-sm text-white/70">
            Lab:{' '}
            <a href="https://woku.app/en" className="underline decoration-white/30 underline-offset-4 hover:decoration-white" rel="noopener">
              woku
            </a>
            , our product in production, where every experiment on this page ran.
          </p>
          <p className="text-xs text-white/50">Light paper · v{VERSION}</p>
        </div>
      </div>
    </footer>
  );
}
