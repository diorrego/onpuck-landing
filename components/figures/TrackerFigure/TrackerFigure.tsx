import Figure from '@/components/figures/Figure';
import Badge from '@/components/ui/Badge';
import Inline from '@/components/ui/Inline';
import { trackerExample } from '@/content/paper';

const cell = 'block py-1.5 md:table-cell md:border-t md:border-line md:px-3 md:py-3 md:align-top';
const label = 'max-md:before:mr-2 max-md:before:text-xs max-md:before:text-ink-faint max-md:before:content-[attr(data-label)]';

export default function TrackerFigure() {
  const ex = trackerExample;
  return (
    <Figure id="trackers">
      <p className="text-sm text-ink-faint">{ex.source}</p>
      <blockquote className="mt-2 text-xl leading-snug italic sm:text-2xl">
        <p>&ldquo;{ex.quote}&rdquo;</p>
      </blockquote>

      <table className="mt-6 w-full border-collapse text-[0.9375rem] max-md:block">
        <thead className="max-md:hidden">
          <tr className="text-left text-sm text-ink-faint">
            <th className="px-3 pb-2 font-normal">Tracker</th>
            <th className="px-3 pb-2 font-normal">User said</th>
            <th className="px-3 pb-2 font-normal">System recorded</th>
            <th className="px-3 pb-2 font-normal">Resolution</th>
          </tr>
        </thead>
        <tbody className="max-md:block">
          {ex.rows.map((row) => (
            <tr key={row.tracker} className="border-t border-line py-2 max-md:block md:border-0">
              <th scope="row" className={`${cell} text-left font-normal`}>
                {row.tracker} <span className="text-sm text-ink-faint">({row.kind})</span>
              </th>
              <td className={`${cell} ${label}`} data-label="Said">
                &ldquo;{row.said}&rdquo;
              </td>
              <td className={`${cell} ${label}`} data-label="Recorded">
                <Inline text={row.recorded} />
              </td>
              <td className={`${cell} ${label}`} data-label="Resolution">
                <Badge tone={row.resolution === 'confirmed' ? 'hit' : 'miss'}>{row.resolution}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 rounded-xl border border-primary/15 bg-primary-soft p-4">
        <p className="text-sm text-primary">Resulting spec</p>
        <p className="mt-1">
          <code>{ex.spec.actionType}</code> {ex.spec.title}
        </p>
        <p className="mt-1 text-ink-soft">{ex.spec.why}</p>
        <p className="mt-2 text-sm text-ink-faint">{ex.spec.evidence}</p>
      </div>
    </Figure>
  );
}
