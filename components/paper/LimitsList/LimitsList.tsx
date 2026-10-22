import Inline from '@/components/ui/Inline';
import type { Limit } from '@/content/paper';

export default function LimitsList({ limits }: { limits: Limit[] }) {
  return (
    <ol className="grid gap-x-12 md:grid-cols-2">
      {limits.map((l) => (
        <li key={l.title} className="border-t-2 border-ink py-6">
          <h3 className="text-xl font-extrabold">{l.title}</h3>
          <p className="mt-2 text-ink-soft">
            <span className="mr-2 font-pixel text-[0.625rem] text-ink">Why not</span>
            <Inline text={l.because} />
          </p>
          <p className="mt-2">
            <span className="mr-2 font-pixel text-[0.625rem]">What we do</span>
            <Inline text={l.mitigation} />
          </p>
        </li>
      ))}
    </ol>
  );
}
