import PixelIcon from '@/components/ui/PixelIcon';
import { paper } from '@/content/paper';
import type { IconName } from '@/lib/scene/sprites';

/** What the bubbles in the scene mean, drawn from the same pixel grids as the scene. */
export default function SceneLegend() {
  return (
    <ul aria-label="Bubble legend" className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-soft">
      {paper.hero.legend.map((item) => (
        <li key={item.icon} className="inline-flex items-center gap-1.5">
          <span className="inline-flex size-6 items-center justify-center rounded-md border border-line bg-white">
            <PixelIcon name={item.icon as IconName} size={2} />
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
