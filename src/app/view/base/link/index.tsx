import {
  cn,
  Link as NextUILink,
  LinkProps as NextUILinkProps,
} from '@heroui/react';
import React from 'react';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { Tooltip, TooltipProps } from '~/view/base/tooltip';
import { IconOnlyButton, IconOnlyButtonProps } from './icon-only-button';

export interface LinkProps extends NextUILinkProps {
  /** Link contains icon only, should not provide a children in this case */
  iconOnly?: IconOnlyButtonProps;
  tooltip?: string;
  tooltipProps?: TooltipProps;
}

export const Link = React.forwardRef<HTMLAnchorElement | null, LinkProps>(
  (props, ref) => {
    const { className, iconOnly, tooltip, tooltipProps, ...linkProps } = props;
    const linkRef = useForwardRef<HTMLAnchorElement>(ref);

    const renderLink = React.useMemo(() => {
      return (
        <NextUILink
          ref={linkRef}
          className={cn(
            'underline decoration-dotted hover:decoration-solid',
            className
          )}
          {...(iconOnly != null && {
            isBlock: true,
            ...(iconOnly?.openInNewWindow && { target: '_blank' }),
            children: <IconOnlyButton {...iconOnly} />,
          })}
          {...linkProps}
        />
      );
    }, [className, iconOnly, linkProps, linkRef]);

    return tooltip ? (
      <Tooltip content={tooltip} {...tooltipProps}>
        {renderLink}
      </Tooltip>
    ) : (
      renderLink
    );
  }
);

Link.displayName = 'Link';
