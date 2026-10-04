import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Building AI for continuous customer development with hard data',
  description:
    'Agentic Customer Development for helping startup teams decide what to build next.',
  openGraph: {
    title: 'Building AI for continuous customer development with hard data',
    description:
      'Agentic Customer Development for helping startup teams decide what to build next.',
    url: 'https://onpuck.com',
    siteName: 'woku',
    images: [
      {
        url: 'https://onpuck.com/og-landing.jpg',
        width: 1200,
        height: 630,
        alt: 'Agentic Customer Development for helping startup teams decide what to build next.',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building AI for continuous customer development with hard data',
    description:
      'Agentic Customer Development for helping startup teams decide what to build next.',
    images: ['https://onpuck.com/og-landing.jpg'],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
