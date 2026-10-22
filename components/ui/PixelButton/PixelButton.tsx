import type { ReactNode } from 'react';

type Common = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  event?: string;
  className?: string;
  ariaLabel?: string;
};
type AsLink = Common & { href: string; type?: never; disabled?: never };
type AsButton = Common & { href?: never; type?: 'button' | 'submit'; disabled?: boolean; onClick?: () => void };

/** One-bit desktop button with a hard offset shadow that the press pushes into. */
export default function PixelButton(props: AsLink | AsButton) {
  const { children, variant = 'primary', size = 'md', event, className = '', ariaLabel } = props;
  const classes = `pixel-btn pixel-btn-${variant} ${size === 'sm' ? 'pixel-btn-sm' : ''} ${className}`.trim();
  if (props.href !== undefined) {
    return (
      <a href={props.href} className={classes} data-event={event} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <button
      type={props.type ?? 'button'}
      className={classes}
      data-event={event}
      aria-label={ariaLabel}
      disabled={props.disabled}
      aria-disabled={props.disabled || undefined}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}
