// The simulation floor: one isometric cutaway with a kitchen (back corner), a coworking floor
// (right wall), a living room (left wall) and a street corner (front). Seats and spots are
// hand-placed; people walk the tile grid with BFS, so moves are always iso diagonals.

import type { Pose, PropName, View } from './sprites';

export type Zone = 'kitchen' | 'coworking' | 'living' | 'street';
export type Material = 'tile' | 'wood' | 'carpet' | 'rug' | 'pavement' | 'grass' | 'asphalt';
export type Device = 'laptop' | 'desktop' | 'tablet' | 'phone' | 'speaker';
export type Tile = { zone: Zone; material: Material };

export type PropPlacement = { name: PropName; c: number; r: number; z?: number; depth?: number };

export type Seat = {
  id: string;
  zone: Zone;
  approach: [number, number];
  pos: [number, number];
  z: number;
  view: View;
  mirror: boolean;
  poses: Pose[];
  device: Device;
  tasks: string[];
};

export type Spawn = { id: string; tile: [number, number]; kind: 'door' | 'street' };

const COLS = 14;
const ROWS = 12;

function zoneOf(c: number, r: number): Zone {
  if (c >= 5 && r >= 6) return 'street';
  if (c >= 5) return 'coworking';
  if (r >= 4) return 'living';
  return 'kitchen';
}

function materialOf(c: number, r: number): Material {
  const zone = zoneOf(c, r);
  if (zone === 'kitchen') return 'tile';
  if (zone === 'coworking') return 'wood';
  if (zone === 'living') return c >= 1 && c <= 3 && r >= 5 && r <= 8 ? 'rug' : 'carpet';
  if (r === 11 || c === 13) return 'asphalt';
  if ((c >= 10 && c <= 12 && r >= 6 && r <= 7) || (c >= 5 && c <= 7 && r >= 9 && r <= 10)) return 'grass';
  return 'pavement';
}

const TASKS: Record<Device, string[]> = {
  laptop: ['Exporting a report', 'Inviting a teammate', 'Changing the billing plan'],
  desktop: ['Building a dashboard', 'Setting up an alert', 'Filtering last week’s errors'],
  tablet: ['Comparing plans', 'Reading the settings page', 'Reviewing an invoice'],
  phone: ['Writing a review', 'Resetting a password', 'Checking an order'],
  speaker: ['Asking for an order status', 'Setting a reminder by voice'],
};

const seat = (
  id: string,
  approach: [number, number],
  pos: [number, number],
  z: number,
  view: View,
  mirror: boolean,
  poses: Pose[],
  device: Device,
): Seat => ({ id, zone: zoneOf(...approach), approach, pos, z, view, mirror, poses, device, tasks: TASKS[device] });

const TYPING: Pose[] = ['typeA', 'typeB'];

const seats: Seat[] = [
  // kitchen
  seat('kitchen-stool-1', [2, 3], [2.5, 3.1], 8, 'back', false, ['tablet'], 'tablet'),
  seat('kitchen-stool-2', [3, 3], [3.5, 3.1], 8, 'back', false, ['tablet'], 'phone'),
  seat('kitchen-speaker', [2, 1], [2.7, 1.25], 0, 'back', false, ['talk', 'stand'], 'speaker'),
  // coworking, back row facing the wall
  seat('desk-1', [6, 1], [6.5, 1.02], 8, 'back', false, TYPING, 'laptop'),
  seat('desk-2', [8, 1], [8.5, 1.02], 8, 'back', false, TYPING, 'desktop'),
  seat('desk-3', [10, 1], [10.5, 1.02], 8, 'back', false, TYPING, 'laptop'),
  seat('desk-4', [12, 1], [12.5, 1.02], 8, 'back', false, TYPING, 'desktop'),
  // coworking, front row facing the viewer
  seat('desk-5', [7, 3], [7.85, 3.5], 8, 'front', false, TYPING, 'laptop'),
  seat('desk-6', [7, 4], [7.85, 4.5], 8, 'front', false, TYPING, 'laptop'),
  seat('desk-7', [10, 3], [10.85, 3.5], 8, 'front', false, TYPING, 'laptop'),
  seat('desk-8', [10, 4], [10.85, 4.5], 8, 'front', false, TYPING, 'laptop'),
  // living room
  seat('sofa-1', [1, 6], [0.55, 6.6], 6, 'front', false, ['tablet'], 'tablet'),
  seat('sofa-2', [1, 7], [0.55, 7.45], 6, 'front', false, ['sit', 'tablet'], 'phone'),
  seat('living-speaker', [1, 9], [1.55, 9.5], 0, 'front', false, ['talk', 'stand'], 'speaker'),
  // street corner, bench facing the viewer's left
  seat('bench-1', [8, 9], [8.95, 8.75], 6, 'front', true, ['tablet'], 'phone'),
  seat('bench-2', [9, 9], [9.55, 8.75], 6, 'front', true, ['tablet'], 'phone'),
];

const wanderSpots: [number, number][] = [
  [10, 10],
  [12, 9],
  [7, 7],
  [11, 8],
  [12, 3],
  [6, 4],
  [3, 7],
  [4, 2],
];

const props: PropPlacement[] = [
  // kitchen
  { name: 'fridge', c: 0.15, r: 0.15 },
  { name: 'counter', c: 1, r: 0.05 },
  { name: 'speaker', c: 2.55, r: 0.2, z: 15 },
  { name: 'mug', c: 1.5, r: 0.3, z: 15 },
  { name: 'counter', c: 1.6, r: 2.05 },
  { name: 'stool', c: 2.35, r: 2.95 },
  { name: 'stool', c: 3.35, r: 2.95 },
  { name: 'plant', c: 4.25, r: 0.25 },
  // coworking back row
  ...[6, 8, 10, 12].flatMap((c, i): PropPlacement[] => [
    { name: 'desk', c, r: 0.25 },
    i % 2 === 0
      ? { name: 'laptop', c: c + 0.3, r: 0.4, z: 13 }
      : { name: 'desktop', c: c + 0.25, r: 0.2, z: 13 },
    { name: 'stool', c: c + 0.35, r: 0.88 },
  ]),
  { name: 'mug', c: 6.82, r: 0.45, z: 13 },
  // coworking front row (desks along r)
  ...[8, 11].flatMap((c): PropPlacement[] => [
    { name: 'deskR', c: c + 0.15, r: 3.05 },
    { name: 'deskR', c: c + 0.15, r: 4.05 },
    { name: 'laptopBack', c: c + 0.2, r: 3.3, z: 13 },
    { name: 'laptopBack', c: c + 0.2, r: 4.3, z: 13 },
    { name: 'stool', c: c - 0.45, r: 3.35 },
    { name: 'stool', c: c - 0.45, r: 4.35 },
  ]),
  { name: 'plant', c: 13.4, r: 0.3 },
  { name: 'plant', c: 13.4, r: 4.5 },
  // living room
  { name: 'sofa', c: 0.12, r: 6.0 },
  { name: 'plant', c: 0.2, r: 4.2 },
  { name: 'sideTable', c: 2.45, r: 9.3 },
  { name: 'speaker', c: 2.56, r: 9.41, z: 11 },
  { name: 'plant', c: 3.9, r: 11.4 },
  // street corner
  { name: 'lamp', c: 6.2, r: 6.2 },
  { name: 'bench', c: 8.5, r: 8.25 },
  { name: 'tree', c: 11.45, r: 6.45 },
  { name: 'tree', c: 6.45, r: 9.55 },
];

const blocked = new Set<string>([
  // kitchen
  '0,0', '1,0', '2,0', '1,2', '2,2', '3,2', '4,0',
  // coworking
  '6,0', '7,0', '8,0', '9,0', '10,0', '11,0', '12,0', '13,0',
  '8,3', '8,4', '11,3', '11,4', '13,4',
  // living
  '0,6', '0,7', '0,4', '2,9', '3,11',
  // street
  '6,6', '8,8', '9,8', '11,6', '6,9',
]);

const spawns: Spawn[] = [
  { id: 'door', tile: [0, 10], kind: 'door' },
  { id: 'street-east', tile: [13, 8], kind: 'street' },
  { id: 'street-south', tile: [9, 11], kind: 'street' },
];

export const WORLD = {
  cols: COLS,
  rows: ROWS,
  seats,
  wanderSpots,
  props,
  spawns,
  door: { r0: 10, r1: 11 },
  windows: [
    { wall: 'right' as const, from: 5.4, to: 7.4 },
    { wall: 'right' as const, from: 9.4, to: 11.4 },
    { wall: 'left' as const, from: 1.6, to: 3.2 },
    { wall: 'left' as const, from: 7.6, to: 8.8 },
  ],
};

export function tileAt(c: number, r: number): Tile {
  return { zone: zoneOf(c, r), material: materialOf(c, r) };
}

export function isWalkable(c: number, r: number): boolean {
  return c >= 0 && r >= 0 && c < COLS && r < ROWS && !blocked.has(`${c},${r}`);
}

/** Breadth-first path on the tile grid, 4-neighbour, inclusive of start and goal. */
export function findPath(from: [number, number], to: [number, number]): [number, number][] | null {
  if (!isWalkable(...from) || !isWalkable(...to)) return null;
  const key = (c: number, r: number) => r * COLS + c;
  const prev = new Map<number, number>();
  const queue: [number, number][] = [from];
  prev.set(key(...from), -1);
  while (queue.length) {
    const [c, r] = queue.shift()!;
    if (c === to[0] && r === to[1]) break;
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = c + dc;
      const nr = r + dr;
      if (!isWalkable(nc, nr) || prev.has(key(nc, nr))) continue;
      prev.set(key(nc, nr), key(c, r));
      queue.push([nc, nr]);
    }
  }
  if (!prev.has(key(...to))) return null;
  const path: [number, number][] = [];
  for (let k = key(...to); k !== -1; k = prev.get(k)!) path.unshift([k % COLS, Math.floor(k / COLS)]);
  return path;
}
