import type { ReactNode } from 'react';
import SceneIsland from '@/components/scene/SceneIsland';
import SiteFooter from '@/components/paper/SiteFooter';
import SiteNav from '@/components/paper/SiteNav';
import Button from '@/components/ui/Button';
import { errorCopy, scene } from '@/content/site';

type Props = { title: string; line: string; action?: ReactNode };

/**
 * 404 and runtime errors: the nav, the running floor, one short message and the way back.
 * Imports only content/site, because the error boundary is a client component.
 */
export default function ErrorPage({ title, line, action }: Props) {
  return (
    <>
      <SiteNav base="/" />
      <main id="main" className="border-b border-line">
        <div className="mx-auto flex max-w-[80rem] flex-col items-center px-4 pt-8 pb-16 text-center sm:px-6 md:pt-10 lg:px-8">
          <div className="w-full min-w-0">
            <SceneIsland mode="life" priority label={scene.label} statusLabels={scene.status} maxVh={0.42} />
          </div>
          <h1 className="mt-6 max-w-[24ch] text-3xl leading-tight font-normal sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-balance text-ink-soft">{line}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/">{errorCopy.back}</Button>
            {action}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
