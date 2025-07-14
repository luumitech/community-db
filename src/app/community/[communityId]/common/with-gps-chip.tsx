import { Chip, ChipProps } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props extends ChipProps {
  className?: string;
  withGps: boolean;
}

export const WithGpsChip: React.FC<Props> = ({
  className,
  withGps,
  ...props
}) => {
  return (
    <Chip
      className={className}
      radius="sm"
      variant="flat"
      color="primary"
      {...props}
    >
      <Icon icon={withGps ? 'map' : 'noMap'} />
    </Chip>
  );
};
