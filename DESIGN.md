---
name: OnPuck light paper
description: A concise light paper set like a LaTeX article on a white page, with conventional rounded controls and one running pixel-art simulation.
colors:
  paper: "#ffffff"
  paper-sunk: "#fafafa"
  muted: "#f5f5f5"
  line: "#e5e5e5"
  line-strong: "#d4d4d4"
  ink: "#171717"
  ink-soft: "#525252"
  ink-faint: "#737373"
  primary: "#1d4ed8"
  primary-hover: "#1e40af"
  primary-soft: "#eff6ff"
  primary-tint: "#dbeafe"
  frustration: "#f0604d"
  fatigue: "#f4ab2f"
  motivation: "#35b86b"
typography:
  display:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "clamp(2.4rem, 1.6rem + 2.8vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.12
  headline:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  data:
    fontFamily: "CMU Typewriter Text, Latin Modern Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  control: "0.5rem"
  field: "0.5rem"
  card: "1rem"
  tile: "0.75rem"
  pill: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-desktop: "32px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
    height: "44px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  badge:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 14px"
---

# Design System: OnPuck light paper

## Overview

**Creative North Star: "The LaTeX paper with a live figure"**

The page is a research paper written as marketing: a centred title page (display line, one line, two actions, the authors "P. Riquelme and D. Orrego", the live figure, then the H1), then numbered sections, numbered figures, citations and a references list that the visitor opens on demand. It is set in Computer Modern with regular-weight titles and justified, hyphenated prose, like an article compiled with LaTeX, on a plain white page.

Controls are conventional and calm, in the family of woku.app and simile.com: rounded blue-700 buttons, white cards with a soft border and shadow, rounded pills, a segmented control. The only illustration is the isometric pixel-art simulation floor under the title, where simulated people work, get frustrated and leave by the paper's own hazard rule. Pixel art never appears in the interface chrome.

**Key Characteristics:**
- White page, neutral greys, one primary (blue-700).
- Computer Modern everywhere; titles regular weight; prose justified on tablet and up.
- Rounded controls (8 px), cards (16 px), pills; soft borders and shadows.
- Copy is concise: ledes under 25 words, paragraphs under 45.
- Coral, amber and green are data only (frustration, fatigue, motivation).

## Colors

Neutral paper with a single blue.

### Primary
- **Blue 700** (#1d4ed8): primary buttons, links and citation numbers, figure labels ("Figure 3"), step labels, the active contents item, simulator series in charts. Hover is blue 800 (#1e40af); tints #eff6ff and #dbeafe for soft fills and selection.

### Neutral
- **White** (#ffffff) page and cards; **Sunk** (#fafafa) tiles and table heads; **Muted** (#f5f5f5) tracks and code; **Line** (#e5e5e5) borders and rules; **Ink** (#171717), **Soft** (#525252), **Faint** (#737373) text.

### Data
- **Frustration** (#f0604d), **Fatigue** (#f4ab2f), **Motivation** (#35b86b): meter fills, scene bubbles and status dots, outcome badges (with darker text variants).

### Named Rules
**The One Blue Rule.** Blue 700 is the only accent. Everything else is neutral or data.

**The Data-Only Triad Rule.** Coral, amber and green always mean a state value.

## Typography

**Font:** CMU Serif (Computer Modern Unicode, OFL, self-hosted in `public/fonts`), with Latin Modern and Georgia as fallbacks. **Data font:** CMU Typewriter Text.

### Hierarchy
- **Display** (400, clamp(2.4rem to 3.75rem), 1.12): the hero line, centred. It is a paragraph, not the H1.
- **H1** (400, 1.25rem to 1.5rem, balanced): under the hero figure; says what OnPuck does, for whom and where, like the meta description.
- **Headline** (400, 1.875rem to 2.25rem): section H2s preceded by the section number, LaTeX style ("4 How accurate are simulated users? Our validation"). H2s are written as the searches they answer; the contents rail uses each section's short label.
- **Title** (700, 1.25rem): step, limit and card headings.
- **Body** (400, 1.1875rem, 1.6, 64ch): justified with hyphenation from 768 px.
- **Caption**: "Figure N: ..." centred under the figure, 0.9375rem.
- **Data** (CMU Typewriter): intervals, formulas, code, experiment ids.

### Named Rules
**The Light Titles Rule.** Headings are regular weight; weight comes only for small titles and labels.

**The OnPuck Rule.** The brand is written OnPuck (capital O and P). Emails and domains stay lowercase.

## Layout

80rem container, 16/32 px gutters. Centred hero: display line, subline, actions, authors, then the scene fitted to the container, its caption and the H1 (whole-device-pixel scale when within 85% of the fitted size). Below, a 13rem sticky contents rail on extra-large screens (collapsible on smaller ones) and a 64ch column; figures, tables and lists break out wider. Sections are separated by a 1 px rule.

## Elevation & Depth

Flat surfaces with soft shadows: `--shadow-card` (0 1px 2px / 4%, 0 4px 16px / 5%) on cards and tables, `--shadow-float` (0 8px 30px / 12%) on the scene's state card and callouts. No hard offset shadows.

## Shapes

Buttons and fields 8 px, tiles 12 px, cards and tables 16 px, badges and the status bar fully rounded. Lucide icons (stroke) for interface glyphs; pixel icons only in the scene legend.

## Components

All foundational components live in `components/ui/<Name>/` and the interactive ones are built on Base UI (`@base-ui/react`).

- **Button** (Base UI Button; links are `<a>` with the same classes): primary blue, secondary white with a grey border, small variant in the nav.
- **Card**: white, 1 px line, 16 px radius, optional header with a blue label and a title.
- **Badge**: pill with a tinted fill and an inset ring per tone.
- **TextField** (Base UI Field): bold label, 8 px field, blue focus ring, server errors from Base UI Form.
- **Accordion** (FAQ) and **Disclosure** (contents, references) on Base UI, closed panels kept in the HTML (`hidden="until-found"`).
- **SegmentedToggle** (Base UI ToggleGroup): grey track, white pressed segment.
- **StateMeter** (Base UI Meter): rounded bar in the state colour.
- **Simulation floor**: poster PNG first, Canvas 2D engine after load, state card on hover, tap or keyboard, live status pill.

## Do's and Don'ts

### Do:
- **Do** keep copy short; let the figures and references carry detail.
- **Do** keep references collapsed by default and open them when a citation is followed.
- **Do** keep every word in the DOM; the canvas holds pixels only.

### Don't:
- **Don't** use pixel-art or retro-game chrome (bitmap fonts, striped title bars, hard offset shadows) in the interface.
- **Don't** add a second accent colour.
- **Don't** set titles bold or tightly tracked.
- **Don't** write the brand in lowercase.
