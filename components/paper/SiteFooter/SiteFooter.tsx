import Logo from '@/components/ui/Logo';
import { CONTACT_EMAIL, PURPOSE_LINE, VERSION, founders } from '@/content/paper';

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-paper-raised">
      <div className="mx-auto grid max-w-[80rem] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="grid content-start gap-4">
          <span className="flex items-center gap-2">
            <Logo size={34} decorative />
            <span className="text-2xl font-extrabold tracking-[-0.03em]">onpuck</span>
          </span>
          <p className="max-w-[34ch] text-lg leading-snug">{PURPOSE_LINE}</p>
        </div>
        <div>
          <h2 className="font-pixel text-[0.6875rem] text-paper-raised/70">Founders</h2>
          <ul className="mt-3 grid gap-3">
            {founders.map((f) => (
              <li key={f.name}>
                <span className="font-bold">{f.name}</span>, {f.role.toLowerCase()}. <span className="text-paper-raised/80">{f.line.replace(` Your first contact: ${CONTACT_EMAIL}.`, '')}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-3">
          <h2 className="font-pixel text-[0.6875rem] text-paper-raised/70">Contact</h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg font-bold underline underline-offset-4 hover:bg-glow hover:text-ink">
            {CONTACT_EMAIL}
          </a>
          <p className="text-paper-raised/80">
            Lab:{' '}
            <a href="https://woku.app" className="underline underline-offset-4 hover:bg-glow hover:text-ink" rel="noopener">
              woku
            </a>
            , our feedback product in production, where every experiment on this page ran.
          </p>
          <p className="font-pixel text-[0.625rem] text-paper-raised/60">Light paper · Version {VERSION}</p>
        </div>
      </div>
    </footer>
  );
}
