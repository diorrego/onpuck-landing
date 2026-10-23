import Badge, { type Tone } from '@/components/ui/Badge';
import { experiments } from '@/content/experiments';

const cell = 'block py-1 md:table-cell md:px-4 md:py-4 md:align-top';
const label = 'max-md:before:block max-md:before:text-xs max-md:before:font-semibold max-md:before:text-ink-faint max-md:before:content-[attr(data-label)]';

export default function ExperimentsTable() {
  return (
    <div className="lg:-mx-16 xl:-mx-24">
      <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-line bg-white text-[0.9375rem] shadow-[var(--shadow-card)] max-md:block max-md:border-0 max-md:bg-transparent max-md:shadow-none">
        <caption className="sr-only">OnPuck experiments on woku: question, sample, prediction, reality and verdict</caption>
        <thead className="max-md:hidden">
          <tr className="bg-paper-sunk text-left text-xs font-semibold tracking-wide text-ink-faint uppercase">
            <th className="border-b border-line px-4 py-3 font-semibold">Experiment</th>
            <th className="border-b border-line px-4 py-3 font-semibold">Question</th>
            <th className="border-b border-line px-4 py-3 font-semibold">Predicted vs real</th>
            <th className="border-b border-line px-4 py-3 font-semibold">Verdict</th>
          </tr>
        </thead>
        <tbody className="max-md:grid max-md:gap-3">
          {experiments.map((e, i) => (
            <tr
              key={e.id}
              id={e.id}
              className={`scroll-mt-24 target:bg-primary-soft max-md:block max-md:rounded-xl max-md:border max-md:border-line max-md:bg-white max-md:p-4 ${i > 0 ? 'md:[&>*]:border-t md:[&>*]:border-line' : ''}`}
            >
              <th scope="row" className={`${cell} text-left font-normal md:w-[11rem]`}>
                <span className="block font-mono text-xs text-ink-faint">{e.id}</span>
                <span className="block font-semibold text-ink">{e.name}</span>
                <span className="mt-2 inline-block">
                  <Badge tone={e.outcome as Tone}>{e.outcomeLabel}</Badge>
                </span>
              </th>
              <td className={`${cell} ${label} md:w-[16rem]`} data-label="Question">
                <p className="text-ink">{e.question}</p>
                <p className="mt-1 text-sm text-ink-faint">{e.n}</p>
              </td>
              <td className={`${cell} md:w-[15rem]`}>
                <span className="block text-xs font-semibold text-ink-faint">Predicted</span>
                <span className="block font-mono text-[0.8125rem] tabular-nums">{e.predicted}</span>
                <span className="mt-2 block text-xs font-semibold text-ink-faint">Real</span>
                <span className="block font-mono text-[0.8125rem] tabular-nums">{e.real}</span>
              </td>
              <td className={`${cell} ${label} text-ink-soft`} data-label="Verdict">
                {e.verdict}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
