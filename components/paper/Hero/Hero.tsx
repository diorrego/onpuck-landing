import PixelButton from '@/components/ui/PixelButton';
import SceneIsland from '@/components/scene/SceneIsland';
import SceneLegend from '@/components/scene/SceneLegend';
import { paper } from '@/content/paper';

export default function Hero() {
  const h = paper.hero;
  return (
    <header id="top" className="relative">
      <div className="mx-auto grid max-w-[80rem] gap-x-12 gap-y-6 px-4 pt-10 pb-6 sm:px-6 md:pt-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:px-8 lg:pt-16">
        <h1 className="text-display font-extrabold">{h.headline}</h1>
        <div className="flex flex-col justify-end gap-6">
          <p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl">{h.subline}</p>
          <div className="flex flex-wrap items-center gap-4">
            <PixelButton href={h.primaryCta.href} event="cta_click">
              {h.primaryCta.label}
            </PixelButton>
            <PixelButton href={h.secondaryCta.href} variant="secondary" event="paper_link_click">
              {h.secondaryCta.label}
            </PixelButton>
          </div>
          <p className="text-sm text-ink-soft">{h.byline}</p>
        </div>
      </div>
      <div className="relative">
        <SceneIsland mode="life" priority label={h.sceneLabel} />
        <div className="mx-auto flex max-w-[80rem] flex-col gap-3 px-4 pt-3 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <p className="max-w-[70ch] text-[0.9375rem] leading-relaxed text-ink-soft">
            <span className="font-bold text-ink">{h.sceneLabel}.</span> {h.sceneCaption}{' '}
            <span className="max-lg:block">{h.sceneHint}</span>
          </p>
          <SceneLegend />
        </div>
      </div>
    </header>
  );
}
