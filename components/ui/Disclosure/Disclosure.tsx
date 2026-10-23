'use client';

import type { ReactNode } from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDown } from 'lucide-react';

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
};

/** A collapsible panel on Base UI Collapsible; closed content stays in the DOM (until-found). */
export default function Disclosure({ title, children, className = '', open, onOpenChange, triggerClassName = '' }: Props) {
  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange} className={`group ${className}`.trim()}>
      <Collapsible.Trigger
        className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-white px-4 py-3 text-left font-semibold text-ink hover:bg-paper-sunk ${triggerClassName}`.trim()}
      >
        {title}
        <ChevronDown aria-hidden="true" className="size-5 flex-none text-ink-faint transition-transform duration-200 group-data-open:rotate-180" />
      </Collapsible.Trigger>
      <Collapsible.Panel hiddenUntilFound>{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}
