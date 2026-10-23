import { PALETTE } from '@/lib/scene/palette';
import { ICON_COLORS, ICON_GRIDS, type IconName } from '@/lib/scene/sprites';

type Props = { name: IconName; size?: number; className?: string; color?: string };

/** One path per colour: each horizontal run of pixels becomes a rectangle command. */
function paths(grid: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (ICON_COLORS[ch]) out[ch] = `${out[ch] ?? ''}M${x} ${y}h${end - x}v1h-${end - x}z`;
      x = end;
    }
  });
  return out;
}

/** A scene bubble icon as crisp SVG, drawn from the same grid as the canvas sprite (legend only). */
export default function PixelIcon({ name, size = 2, className, color }: Props) {
  const grid: readonly string[] = ICON_GRIDS[name];
  const w = grid[0].length;
  const h = grid.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * size}
      height={h * size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {Object.entries(paths(grid)).map(([ch, d]) => (
        <path key={ch} d={d} fill={color && ch === 'k' ? color : PALETTE[ICON_COLORS[ch]]!} />
      ))}
    </svg>
  );
}
