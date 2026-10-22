import { PALETTE } from '@/lib/scene/palette';
import { ICON_COLORS, ICON_GRIDS, type IconName } from '@/lib/scene/sprites';

type Props = { name: IconName; size?: number; className?: string };

/** A scene bubble icon as crisp SVG, drawn from the same grid as the canvas sprite. */
export default function PixelIcon({ name, size = 2, className }: Props) {
  const grid = ICON_GRIDS[name];
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
      {grid.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ICON_COLORS[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PALETTE[ICON_COLORS[ch]]!} /> : null,
        ),
      )}
    </svg>
  );
}
