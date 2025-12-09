import { cn } from '@heroui/react';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { Icon, IconProps } from '~/view/base/icon';

export interface IconOnlyButtonProps {
  className?: string;
  icon: IconProps['icon'];
  /** Overlay an `Open in new window` icon on the above icon */
  openInNewWindow?: boolean;
  /** Specify a new size for the openInNewWindow icon */
  openInNewWindowIconSize?: number;
}

export const IconOnlyButton: React.FC<IconOnlyButtonProps> = ({
  className,
  icon,
  openInNewWindow,
  openInNewWindowIconSize,
}) => {
  return (
    <>
      <FlatButton className="text-primary" icon={icon} />
      {!!openInNewWindow && (
        <Icon
          className="absolute right-[2px] top-[1px] rotate-[135deg]"
          icon="leftArrow"
          size={openInNewWindowIconSize ?? 9}
        />
      )}
    </>
  );
};
