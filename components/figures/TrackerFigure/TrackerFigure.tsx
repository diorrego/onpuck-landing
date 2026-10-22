import Figure from '@/components/figures/Figure';
import Inline from '@/components/ui/Inline';
import StatusChip from '@/components/ui/StatusChip';
import { trackerExample } from '@/content/paper';

const cell = 'block border-ink/15 py-1.5 md:table-cell md:border-t-2 md:px-3 md:py-3 md:align-top';
const label = 'max-md:before:mr-2 max-md:before:font-pixel max-md:before:text-[0.625rem] max-md:before:content-[attr(data-label)]';

export default function TrackerFigure() {
  const ex = trackerExample;
  return (
    <Figure id="trackers">
      <p className="font-pixel text-[0.6875rem] text-ink-soft">{ex.source}</p>
      <blockquote className="mt-2 text-xl leading-snug font-medium sm:text-2xl">
        <p>&ldquo;{ex.quote}&rdquo;</p>
      </blockquote>

      <table className="mt-6 w-full border-collapse text-[0.9375rem] max-md:block">
        <thead className="max-md:hidden">
          <tr className="text-left font-pixel text-[0.6875rem]">
            <th className="px-3 pb-2 font-normal">Tracker</th>
            <th className="px-3 pb-2 font-normal">User said</th>
            <th className="px-3 pb-2 font-normal">System recorded</th>
            <th className="px-3 pb-2 font-normal">Resolution</th>
          </tr>
        </thead>
        <tbody className="max-md:block">
          {ex.rows.map((row) => (
            <tr key={row.tracker} className="border-t-2 border-ink/15 py-2 max-md:block md:border-0">
              <th scope="row" className={`${cell} text-left font-bold`}>
                {row.tracker} <span className="font-pixel text-[0.625rem] font-normal text-ink-soft">{row.kind}</span>
              </th>
              <td className={`${cell} ${label}`} data-label="Said">
                &ldquo;{row.said}&rdquo;
              </td>
              <td className={`${cell} ${label}`} data-label="Recorded">
                <Inline text={row.recorded} />
              </td>
              <td className={`${cell} ${label}`} data-label="Resolution">
                <StatusChip tone={row.resolution === 'confirmed' ? 'hit' : 'miss'}>{row.resolution}</StatusChip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 grid gap-x-6 gap-y-2 border-2 border-ink bg-paper-sunk p-4 sm:grid-cols-[auto_1fr]">
        <span className="font-pixel text-[0.6875rem]">Spec</span>
        <p>
          <code>{ex.spec.actionType}</code> <span className="font-bold">{ex.spec.title}</span>
        </p>
        <span className="font-pixel text-[0.6875rem]">Why</span>
        <p className="text-ink-soft">{ex.spec.why}</p>
        <span className="font-pixel text-[0.6875rem]">Evidence</span>
        <p className="font-mono text-sm">{ex.spec.evidence}</p>
      </div>
    </Figure>
  );
}
