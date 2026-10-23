'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Disclosure from '@/components/ui/Disclosure';

type Props = { count: number; children: ReactNode };

/**
 * The references list, closed by default (the visitor chooses to read it). It stays in the HTML
 * (until-found) for crawlers, and opens itself when a citation or a #ref-N link is followed.
 */
export default function ReferencesDisclosure({ count, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const reveal = (hash: string) => {
      if (!hash.startsWith('#ref-')) return;
      setOpen(true);
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView?.({ block: 'center' }));
    };
    reveal(window.location.hash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#ref-"]');
      if (a) reveal(a.getAttribute('href')!);
    };
    const onHash = () => reveal(window.location.hash);
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHash);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  return (
    <Disclosure title={open ? 'Hide references' : `Show all ${count} references`} open={open} onOpenChange={setOpen}>
      <div className="pt-6">{children}</div>
    </Disclosure>
  );
}
