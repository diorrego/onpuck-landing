'use client';

import { useEffect } from 'react';
import { track, type EventName } from '@/lib/analytics';

/** Funnel events by delegation (PLAN 7.1), and the current section marked in the contents.
 * faq_open comes from ui/Accordion. */
export default function PaperAnalytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('a, button, summary');
      if (!el) return;
      const href = el.getAttribute('href') ?? '';
      const exp = href.match(/^#(exp-\d{2})$/);
      if (exp) return track('experiment_expand', { experiment: exp[1] });
      const event = el.dataset.event as EventName | undefined;
      if (!event) return;
      track(event, {
        ...(href ? { target: href } : {}),
        label: (el.textContent ?? '').trim().slice(0, 80),
        ...(el.dataset.ref ? { ref: el.dataset.ref } : {}),
      });
    };

    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          for (const a of document.querySelectorAll('[data-toc]')) {
            if (a.getAttribute('data-toc') === id) a.setAttribute('aria-current', 'location');
            else a.removeAttribute('aria-current');
          }
          if (!seen.has(id)) {
            seen.add(id);
            track('scroll_section', { section: id });
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    for (const s of document.querySelectorAll('section[id]')) io.observe(s);

    document.addEventListener('click', onClick);
    return () => {
      io.disconnect();
      document.removeEventListener('click', onClick);
    };
  }, []);
  return null;
}
