import type { Metadata } from 'next';
import ErrorPage from '@/components/paper/ErrorPage';
import { errorCopy } from '@/content/site';

export const metadata: Metadata = {
  title: errorCopy.notFound.meta,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <ErrorPage title={errorCopy.notFound.title} line={errorCopy.notFound.line} />;
}
