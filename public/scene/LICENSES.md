# Scene art: provenance and licence

All art in this folder is original work by onpuck, authored as code in `lib/scene/`
(`sprites.ts` for people, props and icons; `render.ts` for the floor and walls) and rendered
by `scripts/build-scene.ts`. No third-party sprites, tiles or packs are used, no AI-generated
images, and nothing is traced from Pokemon, Habbo, Simile or any other game or site. Devices
are generic and carry no real logos.

| File | What | Source |
|---|---|---|
| `sprites.png`, `sprites.json` | Atlas read by the engine (people, props, bubbles) | `buildAtlas()` |
| `base.png` | Floor and walls | `renderBase()` |
| `poster.png` | Still of the running scene (LCP, reduced motion, no JS) | `Simulation` seed 42 |
| `poster-ab.png` | Still for Fig. 3 | `Simulation` seed 7, A/B mode |

Hand edits: `sprites.png` may be repainted in any pixel editor (LibreSprite, Aseprite) as long
as each frame keeps its rectangle in `sprites.json`. Re-running the build script overwrites it,
so commit hand edits and stop regenerating that file, or port them back to `sprites.ts`.

If a CC0 asset (for example Kenney) is added later, list it here with its URL and licence.
