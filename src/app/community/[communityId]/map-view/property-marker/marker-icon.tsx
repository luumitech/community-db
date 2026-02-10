import { cn } from '@heroui/react';
import React from 'react';
import { Icon, IconProps } from '~/view/base/icon';

interface Props extends Omit<IconProps, 'icon'> {
  className?: string;
  isMember: boolean;
}

export const MarkerIcon: React.FC<Props> = ({
  className,
  isMember,
  ...props
}) => {
  return (
    <Icon
      className={cn(
        'text-success-600',
        isMember ? 'opacity-30' : 'opacity-0',
        className
      )}
      icon="circle"
      {...props}
    />
  );
};
