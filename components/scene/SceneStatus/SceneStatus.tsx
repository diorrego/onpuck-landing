export type SceneStatusLabels = { onFloor: string; frustrated: string; done: string; left: string };
type Stats = { onFloor: number; frustrated: number; done: number; left: number };

/** One-bit status bar under the running floor: what the hazard rule is doing, live. */
export default function SceneStatus({ labels, stats }: { labels: SceneStatusLabels; stats: Stats }) {
  const items: [number, string, string][] = [
    [stats.onFloor, labels.onFloor, ''],
    [stats.frustrated, labels.frustrated, 'bg-frustration'],
    [stats.done, labels.done, 'bg-motivation'],
    [stats.left, labels.left, 'bg-ink'],
  ];
  return (
    <div aria-hidden="true" className="mx-auto mt-2 grid w-fit max-w-[calc(100%-2rem)] grid-cols-2 gap-x-4 gap-y-0.5 border-2 border-ink bg-paper-raised px-3 py-1 text-[0.8125rem] sm:flex sm:flex-nowrap">
      {items.map(([n, label, dot]) => (
        <span key={label} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {dot && <span className={`size-2 ${dot}`} />}
          <span className="font-mono tabular-nums">{n}</span> {label}
        </span>
      ))}
    </div>
  );
}
