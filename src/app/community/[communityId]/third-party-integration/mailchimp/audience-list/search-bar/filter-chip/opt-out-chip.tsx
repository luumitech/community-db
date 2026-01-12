import { Chip, ChipProps } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props extends ChipProps {
  className?: string;
  optOut: boolean;
}

export const OptOutChip: React.FC<Props> = ({
  className,
  optOut,
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
      <Icon icon={optOut ? 'noEmail' : 'email'} />
    </Chip>
  );
};
