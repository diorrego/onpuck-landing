export type SceneStatusLabels = { onFloor: string; frustrated: string; done: string; left: string };
type Stats = { onFloor: number; frustrated: number; done: number; left: number };

/** Live counts under the running floor: what the hazard rule is doing. */
export default function SceneStatus({ labels, stats }: { labels: SceneStatusLabels; stats: Stats }) {
  const items: [number, string, string][] = [
    [stats.onFloor, labels.onFloor, 'bg-ink-faint'],
    [stats.frustrated, labels.frustrated, 'bg-frustration'],
    [stats.done, labels.done, 'bg-motivation'],
    [stats.left, labels.left, 'bg-ink'],
  ];
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-2 grid w-fit max-w-[calc(100%-2rem)] grid-cols-2 gap-x-4 gap-y-0.5 rounded-full border border-line bg-white px-4 py-1.5 text-sm text-ink-soft shadow-xs max-sm:rounded-xl sm:flex sm:flex-nowrap"
    >
      {items.map(([n, label, dot]) => (
        <span key={label} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className={`size-1.5 rounded-full ${dot}`} />
          <span className="text-ink tabular-nums">{n}</span> {label}
        </span>
      ))}
    </div>
  );
}
