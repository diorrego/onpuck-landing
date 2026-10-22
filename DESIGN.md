---
name: onpuck light paper
description: A light paper on a cool paper ground, opened on a running isometric simulation floor, in the grammar of a one-bit desktop.
colors:
  paper: "#f2f4f7"
  paper-raised: "#fbfbfd"
  paper-sunk: "#e6e9f0"
  ink: "#12141c"
  ink-soft: "#464b60"
  ink-faint: "#6b7088"
  rule: "#c9cedb"
  screen-glow: "#9ef0ff"
  frustration: "#f0604d"
  fatigue: "#f4ab2f"
  motivation: "#35b86b"
  frustration-ink: "#b3291a"
  fatigue-ink: "#8a5a00"
  motivation-ink: "#17723f"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.35rem, 1.4rem + 3.6vw, 4.35rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.375rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Silkscreen, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  data:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  gutter-mobile: "16px"
  gutter-desktop: "32px"
  section: "80px"
  block: "32px"
components:
  button-primary:
    backgroundColor: "{colors.screen-glow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "11px 20px 12px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "11px 20px 12px"
    height: "48px"
  button-small:
    backgroundColor: "{colors.screen-glow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "7px 14px 8px"
    height: "40px"
  window:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  window-titlebar:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "28px"
  input:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
  status-chip:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "3px 6px 4px"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-raised}"
---

# Design System: onpuck light paper

## Overview

**Creative North Star: "The Simulation Floor"**

The page reads as a research paper laid on cool paper and opens on the mechanism itself: an isometric pixel-art cutaway (kitchen, coworking floor, living room, street corner) where small simulated users work on laptops, desktops, tablets, phones and a smart speaker. Each one carries frustration, fatigue and motivation, and leaves by the same hazard rule the paper prints in section 3. The scene is the only place with saturated colour and motion; everything around it is ink on paper, organised like a paper: numbered sections, numbered figures, numbered citations, a references list.

Interface chrome borrows the grammar of early one-bit desktops. Figures, the form and the state card are small windows with a 2 px ink frame, a striped title bar and a close box; buttons are hard-edged with an offset shadow that the press pushes into; charts and bars use dithered fills instead of gradients. Nothing is rounded, glassy or softly shadowed. The density is a paper's: generous measure, quiet sections, dense tables only where the evidence is.

It rejects the dark AI landing with a neon accent, the logo-wall SaaS page, and Simile's city (rooms and devices, never landmarks).

**Key Characteristics:**
- Cool paper ground, near-black ink, one accent (screen glow cyan).
- Three state colours used only as data: frustration, fatigue, motivation.
- One-bit desktop windows for figures and the form; pixel buttons with hard offset shadows.
- Pixel art at whole-device-pixel scale, `image-rendering: pixelated`, authored as code.
- Text always in the DOM, never inside the canvas.

## Colors

A restrained ink-on-paper system with one luminous accent and a reserved data triad.

### Primary
- **Screen Glow** (#9ef0ff): the light of a screen in the scene, used as the only interface accent: primary button fill, link and summary hover wash, focus halo, selection, the simulator series in Fig. 4, list markers. Never as text colour.

### Neutral
- **Cool Paper** (#f2f4f7): page ground. Cool, never cream.
- **Raised Paper** (#fbfbfd): window bodies, inputs, chips, secondary buttons.
- **Sunk Paper** (#e6e9f0): inline code, the spec card, the calendar fallback.
- **Ink** (#12141c): text, every border, offset shadows, the footer ground, the experiments table header.
- **Soft Ink** (#464b60): ledes, captions, secondary text (7:1 on paper).
- **Faint Ink** (#6b7088): placeholders and the hover self-link icon only.
- **Rule** (#c9cedb): inline code border.

### Data (state colours)
- **Frustration Coral** (#f0604d), **Fatigue Amber** (#f4ab2f), **Motivation Green** (#35b86b): fills for the R, F, M meters, scene bubbles, the status bar dots, outcome chips. Their **-ink** companions (#b3291a, #8a5a00, #17723f) carry text on tinted chips and form errors at AA contrast.

### Named Rules
**The One Glow Rule.** Screen glow is the only accent. Links are ink with an underline; a second accent (a link blue) is a defect.

**The Data-Only Triad Rule.** Coral, amber and green mean frustration, fatigue and motivation. They never decorate props, clothes, headings or buttons.

## Typography

**Display and Body Font:** Schibsted Grotesk (with ui-sans-serif, system-ui)
**Label Font:** Silkscreen (with ui-monospace)
**Data Font:** Martian Mono (with ui-monospace)

**Character:** a news grotesk with a heavy, compact display cut carries the paper's voice; a bitmap face labels the machine (window titles, step numbers, status chips); a mono sets only measurements, intervals, formulas and code.

### Hierarchy
- **Display** (800, clamp(2.35rem, 1.4rem + 3.6vw, 4.35rem), 1.02, -0.035em): the one H1.
- **Headline** (800, 1.875rem to 2.375rem, 1.1, -0.025em): section H2s, preceded by the § number in the label face.
- **Title** (800, 1.25rem to 1.5rem): step and limit H3s, loop node names.
- **Lede** (400 to 500, 1.125rem to 1.4rem, 1.6): the claim under each H2; the abstract is the largest.
- **Body** (400, 1.0625rem, 1.6, max 68ch): paper prose, `text-wrap: pretty`.
- **Label** (Silkscreen 400, 0.625rem to 0.75rem): window titles, "Step N", "Evidence", chips, table heads. Silkscreen sets capitals only.
- **Data** (Martian Mono, 0.75rem to 1.125rem, tabular): Δ values and intervals, formulas, `code`, citation numbers.

### Named Rules
**The Lowercase Brand Rule.** "onpuck" is never set in Silkscreen, because the face has no lowercase. Labels that would contain the name are reworded or set in the grotesk.

**The Mono Is Measurement Rule.** Martian Mono appears only where a value is measured, computed or typed. Never as a "technical" costume for prose.

## Layout

Single column paper on a 80rem container with 16 px (mobile) and 32 px (desktop) gutters. Prose holds a 68ch measure; figures, the experiments table, the lineage list, the program terms and the apply panel break out wider (negative inline margins of 4 to 6rem on large screens). On extra-large screens a 13rem sticky contents rail sits left and marks the current section; below that the contents collapse into a disclosure. Sections are separated by a 2 px ink rule with 56 to 80 px above the heading and less below. The hero is two columns on large screens (H1 left; subline, actions and byline right), then the scene full width beneath, centred at the largest whole-device-pixel scale that fits 64% of the viewport height. Tables stack into labelled blocks under 768 px.

## Elevation & Depth

Flat surfaces with structural, zero-blur offset shadows from the one-bit desktop world. There is no ambient shadow, blur or glass anywhere.

### Shadow Vocabulary
- **Window** (`box-shadow: 4px 4px 0 #12141c`): figures, the form window.
- **Button** (`box-shadow: 4px 4px 0 #12141c`; small `3px 3px 0`): grows to 5 px on hover, collapses to 0 on press.
- **Card and callout** (`box-shadow: 2px 2px 0 to 3px 3px 0 #12141c`): the state card, still-scene callouts.

### Named Rules
**The Press-In Rule.** Offset shadows are mechanical: hover lifts by 1 px, press translates into the shadow and removes it. They never soften, blur or tint.

## Shapes

Square corners everywhere (0 px). Every container is drawn with a 2 px ink border; dashed borders mark something designed but not built, or the loop's return cell. Dithered checkerboards (4 px) shade bars and the real interval band. Pixel icons are drawn from text grids as one SVG path per colour, `shape-rendering: crispEdges`.

## Components

### Buttons
- **Shape:** square, 2 px ink border, hard offset shadow (4 px).
- **Primary:** screen glow fill, ink text, 700 weight, 48 px tall. One label everywhere: "Apply to be a design partner" (mobile nav shows "Apply" with the full accessible name).
- **Hover / Focus:** lift 1 px and shadow 5 px; focus is a 3 px ink outline plus a 6 px glow halo.
- **Secondary:** raised paper fill, same geometry.
- **Disabled / Pending:** pressed halfway (2 px), `cursor: progress`.

### Windows (signature)
- **Frame:** raised paper body, 2 px ink border, 4 px offset shadow.
- **Title bar:** 28 px, horizontal 1 px ink stripes, a 14 px close box, the title in Silkscreen on a paper patch ("Fig. 3  Simulated run").
- **Use:** every numbered figure, the formulas, the application form, the state card (smaller title bar).

### Status chips
- **Style:** Silkscreen label in a 2 px bordered box; tones: hit (green tint), partial (amber tint), miss (coral tint), pending and prototype (glow), by hand (sunk paper), designed (dashed, soft ink).

### Inputs
- **Style:** raised paper, 2 px ink border, square, 16 px text; labels bold above.
- **Focus:** the global ink outline and glow halo; background to white.
- **Error:** border and message in frustration ink, `aria-invalid`, message linked by `aria-describedby`, focus moves to the first invalid field.

### Navigation
- **Style:** sticky 64 px bar on paper with a 2 px ink bottom rule; logo mark and lowercase wordmark left, five section links (600 weight, glow wash on hover) and the small primary button right. Links collapse on mobile; the button stays.

### Simulation floor (signature)
- **Poster first:** a server-rendered lossless PNG (432 x 280) is the LCP image and the reduced-motion, save-data and no-JS state, with labelled callouts when still.
- **Engine:** Canvas 2D at native resolution, scaled by CSS with `image-rendering: pixelated`; boots after load and idle when visible; pauses offscreen, on hidden tabs and after 45 s idle.
- **State card:** a small window over the person (hover, tap or the "Inspect a person" button): device, task, R, F, M meters, risk of leaving.
- **Status bar:** a bordered strip under the floor with live counts (on the floor, frustrated now, tasks done, gave up and left); its height is reserved from first paint.

### State meter
- **Style:** Silkscreen label, ten stepped cells inside a 2 px frame filled in the state colour, the value in Martian Mono; exposed as `role="meter"`.

## Do's and Don'ts

### Do:
- **Do** keep every word in the DOM; the canvas holds pixels and icons only.
- **Do** scale pixel art by whole device pixels and keep `image-rendering: pixelated` on the poster and canvas.
- **Do** draw new icons as pixel grids (`components/ui/PixelIcon`), one path per colour.
- **Do** label anything illustrative as synthetic or an illustration, in the caption.
- **Do** put the claim in the lede and the evidence (a citation or an experiment link) in the same block.

### Don't:
- **Don't** add a second accent colour, gradients, glass, blur or soft shadows.
- **Don't** use coral, amber or green for anything that is not a state value.
- **Don't** set "onpuck" in Silkscreen or capitalise it.
- **Don't** place a kicker or eyebrow above a heading; bylines and versions go after the headline.
- **Don't** use text characters (+, −, #, arrows) as icons.
- **Don't** round corners.
