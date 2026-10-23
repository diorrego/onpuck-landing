import Inline from '@/components/ui/Inline';
import type { Limit } from '@/content/paper';

export default function LimitsList({ limits }: { limits: Limit[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {limits.map((l) => (
        <li key={l.title} className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-lg font-bold">{l.title}</h3>
          <p className="mt-2 text-sm text-ink-soft">
            <span className="mr-1.5 font-semibold text-ink">Why not.</span>
            <Inline text={l.because} />
          </p>
          <p className="mt-1.5 text-sm text-ink-soft">
            <span className="mr-1.5 font-semibold text-primary">What we do.</span>
            <Inline text={l.mitigation} />
          </p>
        </li>
      ))}
    </ol>
  );
}
