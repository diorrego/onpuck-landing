import type { ReactNode } from 'react';

type Props = {
  /** Small label above the title, in the primary colour (for example "Fig. 2"). */
  label?: string;
  title?: string;
  titleId?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  actions?: ReactNode;
};

/** White card with a soft border and shadow; an optional header carries a label and a title. */
export default function Card({ label, title, titleId, children, className = '', bodyClassName = '', actions }: Props) {
  return (
    <div className={`card overflow-hidden ${className}`.trim()}>
      {(title || label) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <p className="flex items-baseline gap-2.5" id={titleId}>
            {label && <span className="text-sm font-semibold text-primary">{label}</span>}
            {title && <span className="font-semibold text-ink">{title}</span>}
          </p>
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
