import type { Metadata, Viewport } from 'next';
import { Martian_Mono, Schibsted_Grotesk, Silkscreen } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import { paper, SITE_URL } from '@/content/paper';

import './globals.css';

const schibsted = Schibsted_Grotesk({ variable: '--font-schibsted', subsets: ['latin'], display: 'swap' });
const silkscreen = Silkscreen({ variable: '--font-silkscreen', subsets: ['latin'], weight: '400', display: 'swap' });
const martian = Martian_Mono({ variable: '--font-martian', subsets: ['latin'], display: 'swap', adjustFontFallback: false });

const TITLE = 'onpuck: test product specs on simulated users first';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: paper.description,
  alternates: { canonical: '/', types: { 'text/markdown': '/index.md' } },
  openGraph: {
    title: TITLE,
    description: paper.description,
    url: '/',
    siteName: 'onpuck',
    type: 'article',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: paper.description },
  robots: { index: true, follow: true, googleBot: { 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } },
  authors: [{ name: 'Diego' }, { name: 'Paula' }],
  creator: 'onpuck',
};

export const viewport: Viewport = { themeColor: '#f2f4f7', colorScheme: 'light' };

// impeccable direction contract (seed 29dd731c). Kept in the emitted markup for audits.
const CONTRACT = `<!--
THESIS: The page is the mechanism: a light paper opened on a running simulation floor where every person carries R, F and M and quits by the paper's own hazard rule. Refuses the dark neon AI landing, the logo wall and Simile's city.
OWN-WORLD: Cool paper #f2f4f7, near-black ink, one-bit desktop windows (2px ink, striped title bars, close boxes), pixel buttons with hard offset shadows, screen-glow cyan the only accent, coral/amber/green reserved for state data, dithered fills. Schibsted Grotesk; Silkscreen labels; Martian Mono for numbers and code.
STORY: A skeptical CTO sees the mechanism running, reads how it works and where it fails, checks references and misses, applies.
FIRST VIEWPORT: Sticky nav; H1 left, subline + Apply + Read the light paper right; the isometric floor full width beneath at integer scale.
FORM: Founder-pinned "simulation floor" (brief section 3), which beats the roll; seed 29dd731c.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${schibsted.variable} ${silkscreen.variable} ${martian.variable} antialiased`}>
      <GoogleTagManager gtmId="GTM-MGCZH8CB" />
      <Script id="microsoft-clarity" strategy="afterInteractive">
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
