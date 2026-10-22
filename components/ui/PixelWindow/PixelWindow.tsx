import type { ReactNode } from 'react';

type Props = {
  title: string;
  titleId?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  actions?: ReactNode;
};

/** Window frame from the one-bit desktop grammar: striped title bar, close box, 2px ink. */
export default function PixelWindow({ title, titleId, children, className = '', bodyClassName = '', actions }: Props) {
  return (
    <div className={`pixel-window ${className}`.trim()}>
      <div className="pixel-titlebar">
        <span className="pixel-close" aria-hidden="true" />
        <span className="pixel-title" id={titleId}>
          {title}
        </span>
        {actions && <span className="ml-auto flex items-center gap-2 pl-2">{actions}</span>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
