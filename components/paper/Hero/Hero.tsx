import Button from '@/components/ui/Button';
import SceneIsland from '@/components/scene/SceneIsland';
import SceneLegend from '@/components/scene/SceneLegend';
import { paper } from '@/content/paper';

/** The paper's title page, centred: title, one line, actions and authors, then the running floor. */
export default function Hero() {
  const h = paper.hero;
  return (
    <header id="top" className="relative border-b border-line">
      <div className="mx-auto flex max-w-[80rem] flex-col items-center px-4 pt-12 pb-10 text-center sm:px-6 md:pt-16 lg:px-8">
        <h1 className="max-w-[18ch] text-display font-normal">{h.headline}</h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl">{h.subline}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={h.primaryCta.href} event="cta_click">
            {h.primaryCta.label}
          </Button>
          <Button href={h.secondaryCta.href} variant="secondary" event="paper_link_click">
            {h.secondaryCta.label}
          </Button>
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          <span className="text-ink">{h.authors}</span> · OnPuck
        </p>
        <div className="mt-10 w-full min-w-0">
          <SceneIsland mode="life" priority label={h.sceneLabel} statusLabels={h.status} maxVh={0.66} />
          <div className="mx-auto mt-1 flex max-w-[60rem] flex-col items-center gap-3">
            <p className="text-sm leading-relaxed text-ink-soft">
              <span className="text-ink">{h.sceneLabel}.</span> {h.sceneCaption} {h.sceneHint}
            </p>
            <SceneLegend />
          </div>
        </div>
      </div>
    </header>
  );
}
