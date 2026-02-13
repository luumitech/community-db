import {
  cn,
  Tooltip as NextUITooltip,
  TooltipProps as NextUITooltipProps,
} from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useForwardRef } from '~/custom-hooks/forward-ref';

export interface TooltipProps extends NextUITooltipProps {
  /** Fix tooltip to bottom left corner of window */
  isFixed?: boolean;
}

export const Tooltip = React.forwardRef<HTMLElement | null, TooltipProps>(
  (props, ref) => {
    const tooltipRef = useForwardRef<HTMLElement>(ref);
    const { className, classNames, isFixed, ...tooltipProps } = props;
    const { base, content, ...restClassNames } = classNames ?? {};

    return (
      <NextUITooltip
        ref={tooltipRef}
        classNames={{
          base: twMerge(
            // Should be fixed at bottom-right corner of screen
            !!isFixed && 'fixed bottom-0 right-0 max-w-1/2',
            base
          ),
          content: twMerge(
            // For fixed positioned tooltip, just add rounded corner on top left
            !!isFixed && 'rounded-tl-md',
            content
          ),
          ...restClassNames,
        }}
        {...(!!isFixed && {
          color: 'foreground',
          radius: 'none',
          size: 'sm',
        })}
        {...tooltipProps}
      />
    );
  }
);

Tooltip.displayName = 'Tooltip';
