import type { Metadata, Viewport } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import { paper, SITE_URL } from '@/content/paper';

import './globals.css';

const TITLE = 'OnPuck: test product specs on simulated users first';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: paper.description,
  alternates: { canonical: '/', types: { 'text/markdown': '/index.md' } },
  openGraph: {
    title: TITLE,
    description: paper.description,
    url: '/',
    siteName: 'OnPuck',
    type: 'article',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: paper.description },
  robots: { index: true, follow: true, googleBot: { 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } },
  authors: [{ name: 'Paula Riquelme' }, { name: 'Diego Orrego' }],
  creator: 'OnPuck',
};

export const viewport: Viewport = { themeColor: '#ffffff', colorScheme: 'light' };

// impeccable direction contract (seed 29dd731c), revised after Diego's review. Kept in the markup for audits.
const CONTRACT = `<!--
THESIS: A light paper set like a LaTeX article that opens on the mechanism: a running pixel-art floor where every person carries R, F and M and quits by the paper's own hazard rule.
OWN-WORLD: White page, Computer Modern (CMU Serif) with regular-weight titles and justified prose; conventional controls like woku and simile: rounded blue-700 buttons, white cards with soft borders and shadows, pills. Pixel art lives only in the scene; coral, amber and green are data.
STORY: A skeptical CTO reads the title page, watches the mechanism, skims concise sections, opens references if wanted, applies.
FIRST VIEWPORT: Sticky nav; centred title, line, actions and authors (P. Riquelme and D. Orrego), then the isometric floor below inside the container margins.
FORM: Founder-pinned simulation floor, restyled by founder review; seed 29dd731c.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preload" href="/fonts/cmu-serif-500-roman.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <GoogleTagManager gtmId="GTM-MGCZH8CB" />
      <Script id="microsoft-clarity" strategy="lazyOnload">
        {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yt7eu1y73o");
          `}
      </Script>
      <body className="min-h-full bg-paper text-ink">
        <div hidden data-direction-contract dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        {children}
      </body>
    </html>
  );
}
