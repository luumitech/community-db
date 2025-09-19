import {
  cn,
  Link as NextUILink,
  LinkProps as NextUILinkProps,
} from '@heroui/react';
import React from 'react';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { FlatButton } from '~/view/base/flat-button';
import { Icon, IconProps } from '~/view/base/icon';

interface IconOnlyOpt {
  icon: IconProps['icon'];
  tooltip?: string;
  /** Overlay an `Open in new window` icon on the above icon */
  openInNewWindow?: boolean;
  /** Specify a new size for the openInNewWindow icon */
  openInNewWindowIconSize?: number;
}

export interface LinkProps extends NextUILinkProps {
  iconOnly?: IconOnlyOpt;
}

export const Link = React.forwardRef<HTMLAnchorElement | null, LinkProps>(
  (props, ref) => {
    const { className, iconOnly, children, ...linkProps } = props;
    const linkRef = useForwardRef<HTMLAnchorElement>(ref);

    const openInNewWindow = !!iconOnly?.openInNewWindow;
    const renderIconOnly = React.useCallback(() => {
      if (iconOnly == null) {
        return null;
      }

      const { icon, tooltip, openInNewWindowIconSize } = iconOnly;
      return (
        <>
          <FlatButton className="text-primary" icon={icon} tooltip={tooltip} />
          {!!openInNewWindow && (
            <Icon
              className="absolute right-[2px] top-[1px] rotate-[135deg]"
              icon="leftArrow"
              size={openInNewWindowIconSize ?? 9}
            />
          )}
        </>
      );
    }, [iconOnly, openInNewWindow]);

    return (
      <NextUILink
        ref={linkRef}
        className={cn(
          'underline decoration-dotted hover:decoration-solid',
          className
        )}
        {...(openInNewWindow && { target: '_blank' })}
        {...(iconOnly != null && { isBlock: true })}
        {...linkProps}
      >
        {renderIconOnly() ?? children}
      </NextUILink>
    );
  }
);

Link.displayName = 'Link';
