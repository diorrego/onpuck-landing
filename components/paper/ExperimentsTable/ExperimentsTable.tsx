import StatusChip, { type Tone } from '@/components/ui/StatusChip';
import { experiments } from '@/content/experiments';

const cell = 'block py-1 md:table-cell md:border-t-2 md:border-ink/15 md:px-3 md:py-4 md:align-top';
const label = 'max-md:before:block max-md:before:font-pixel max-md:before:text-[0.625rem] max-md:before:text-ink-soft max-md:before:content-[attr(data-label)]';

export default function ExperimentsTable() {
  return (
    <div className="lg:-mx-16 xl:-mx-24">
      <table className="w-full border-collapse border-2 border-ink bg-paper-raised text-[0.9375rem] max-md:block max-md:border-0 max-md:bg-transparent">
        <caption className="sr-only">onpuck experiments on woku: question, sample, prediction, reality and verdict</caption>
        <thead className="max-md:hidden">
          <tr className="bg-ink text-left font-pixel text-[0.6875rem] text-paper-raised">
            <th className="px-3 py-2 font-normal">Experiment</th>
            <th className="px-3 py-2 font-normal">Question and n</th>
            <th className="px-3 py-2 font-normal">Predicted vs real</th>
            <th className="px-3 py-2 font-normal">Verdict</th>
          </tr>
        </thead>
        <tbody className="max-md:grid max-md:gap-4">
          {experiments.map((e) => (
            <tr key={e.id} id={e.id} className="scroll-mt-24 max-md:block max-md:border-2 max-md:border-ink max-md:bg-paper-raised max-md:p-4 target:bg-glow/30">
              <th scope="row" className={`${cell} text-left`}>
                <span className="block font-mono text-sm">{e.id}</span>
                <span className="block font-bold">{e.name}</span>
                <span className="mt-2 inline-block">
                  <StatusChip tone={e.outcome as Tone}>{e.outcomeLabel}</StatusChip>
                </span>
              </th>
              <td className={`${cell} ${label} md:w-[17rem]`} data-label="Question and n">
                <p>{e.question}</p>
                <p className="mt-1.5 text-sm text-ink-soft">n: {e.n}</p>
              </td>
              <td className={`${cell} md:w-[15rem]`}>
                <span className="block font-pixel text-[0.625rem] text-ink-soft">Predicted</span>
                <span className="block font-mono text-[0.8125rem] tabular-nums">{e.predicted}</span>
                <span className="mt-2 block font-pixel text-[0.625rem] text-ink-soft">Real</span>
                <span className="block font-mono text-[0.8125rem] tabular-nums">{e.real}</span>
              </td>
              <td className={`${cell} ${label}`} data-label="Verdict">
                {e.verdict}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
