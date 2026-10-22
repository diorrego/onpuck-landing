import BlockRenderer from '@/components/paper/BlockRenderer';
import Contents from '@/components/paper/Contents';
import Hero from '@/components/paper/Hero';
import PaperSection from '@/components/paper/PaperSection';
import References from '@/components/paper/References';
import SiteFooter from '@/components/paper/SiteFooter';
import SiteNav from '@/components/paper/SiteNav';
import { paper, type Block } from '@/content/paper';

/** The whole light paper, server-rendered. The scene islands are the only client JS of note. */
export default function Paper() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <article>
          <Hero />
          <div className="mx-auto mt-10 grid max-w-[80rem] grid-cols-1 gap-x-12 px-4 sm:px-6 lg:px-8 xl:grid-cols-[13rem_minmax(0,1fr)]">
            <Contents />
            <div className="min-w-0 lg:px-16 xl:px-24">
              {paper.sections.map((s) => (
                <PaperSection key={s.id} id={s.id} number={s.number} title={s.title} lede={s.lede} ledeLarge={s.id === 'abstract'}>
                  {(s.blocks as Block[]).map((b, i) => (
                    <BlockRenderer key={i} block={b} />
                  ))}
                </PaperSection>
              ))}
              <References />
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
