import { Chip, ChipProps } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props extends ChipProps {
  className?: string;
  warning: boolean;
}

export const WarningChip: React.FC<Props> = ({
  className,
  warning,
  ...props
}) => {
  return (
    <Chip
      className={className}
      radius="sm"
      variant="flat"
      color="warning"
      startContent={<Icon icon={warning ? 'warning' : 'noWarning'} />}
      {...props}
    />
  );
};
