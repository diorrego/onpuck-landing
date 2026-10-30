import type { ReactNode } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';

type Common = {
  children: ReactNode;
  /** light and ghost sit on a blue band. */
  variant?: 'primary' | 'secondary' | 'light' | 'ghost';
  size?: 'md' | 'sm';
  event?: string;
  className?: string;
  ariaLabel?: string;
};
type AsLink = Common & { href: string; type?: never; disabled?: never };
type AsButton = Common & { href?: never; type?: 'button' | 'submit'; disabled?: boolean; onClick?: () => void };

/**
 * Rounded button, primary in blue-700. Buttons are Base UI `Button` (focusable while pending);
 * links stay real `<a>` elements, as Base UI asks, with the same look.
 */
export default function Button(props: AsLink | AsButton) {
  const { children, variant = 'primary', size = 'md', event, className = '', ariaLabel } = props;
  const classes = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`.trim();
  if (props.href !== undefined) {
    return (
      <a href={props.href} className={classes} data-event={event} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <BaseButton
      type={props.type ?? 'button'}
      className={classes}
      data-event={event}
      aria-label={ariaLabel}
      disabled={props.disabled}
      focusableWhenDisabled
      onClick={props.onClick}
    >
      {children}
    </BaseButton>
  );
}
