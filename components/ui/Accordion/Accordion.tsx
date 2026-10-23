'use client';

import type { ReactNode } from 'react';
import { Accordion as Base } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { track, type EventName } from '@/lib/analytics';

export type AccordionItem = { id: string; title: string; content: ReactNode };
type Props = {
  items: AccordionItem[];
  onOpen?: (id: string) => void;
  /** Funnel event pushed when an item opens (server parents cannot pass callbacks). */
  trackEvent?: EventName;
  className?: string;
};

/**
 * Base UI Accordion. Panels are `hidden="until-found"` when closed, so every answer stays in the
 * server HTML for crawlers and find-in-page.
 */
export default function Accordion({ items, onOpen, trackEvent, className = '' }: Props) {
  return (
    <Base.Root
      multiple
      hiddenUntilFound
      className={`divide-y divide-line border-y border-line ${className}`.trim()}
      onValueChange={(open) => {
        const last = open.at(-1);
        if (typeof last !== 'string') return;
        onOpen?.(last);
        if (trackEvent) track(trackEvent, { question: last });
      }}
    >
      {items.map((item) => (
        <Base.Item key={item.id} value={item.id} id={item.id} className="group">
          <Base.Header>
            <Base.Trigger className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-ink hover:text-primary">
              <span>{item.title}</span>
              <ChevronDown aria-hidden="true" className="size-5 flex-none text-ink-faint transition-transform duration-200 group-data-open:rotate-180" />
            </Base.Trigger>
          </Base.Header>
          <Base.Panel className="prose-paper pb-6 text-ink-soft">{item.content}</Base.Panel>
        </Base.Item>
      ))}
    </Base.Root>
  );
}
