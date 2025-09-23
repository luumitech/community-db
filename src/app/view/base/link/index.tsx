import {
  cn,
  Link as NextUILink,
  LinkProps as NextUILinkProps,
  Tooltip,
} from '@heroui/react';
import React from 'react';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { FlatButton } from '~/view/base/flat-button';
import { Icon, IconProps } from '~/view/base/icon';

interface IconOnlyOpt {
  icon: IconProps['icon'];
  /** Overlay an `Open in new window` icon on the above icon */
  openInNewWindow?: boolean;
  /** Specify a new size for the openInNewWindow icon */
  openInNewWindowIconSize?: number;
}

export interface LinkProps extends NextUILinkProps {
  /** Link contains icon only, should not provide a children in this case */
  iconOnly?: IconOnlyOpt;
  tooltip?: string;
}

export const Link = React.forwardRef<HTMLAnchorElement | null, LinkProps>(
  (props, ref) => {
    const { className, iconOnly, tooltip, ...linkProps } = props;
    const linkRef = useForwardRef<HTMLAnchorElement>(ref);

    const IconOnlyButton = React.useCallback((opt: IconOnlyOpt) => {
      const { icon, openInNewWindowIconSize } = opt;
      return (
        <>
          <FlatButton className="text-primary" icon={icon} />
          {!!opt.openInNewWindow && (
            <Icon
              className="absolute right-[2px] top-[1px] rotate-[135deg]"
              icon="leftArrow"
              size={openInNewWindowIconSize ?? 9}
            />
          )}
        </>
      );
    }, []);

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
    }, [IconOnlyButton, className, iconOnly, linkProps, linkRef]);

    return tooltip ? (
      <Tooltip content={tooltip}>{renderLink}</Tooltip>
    ) : (
      renderLink
    );
  }
);

Link.displayName = 'Link';
