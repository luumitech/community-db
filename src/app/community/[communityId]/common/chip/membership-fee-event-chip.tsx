import { Chip, ChipProps, cn } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { Icon } from '~/view/base/icon';

interface Props extends ChipProps {
  className?: string;
  eventName: string;
}

export const MembershipFeeEventChip: React.FC<Props> = ({
  className,
  eventName,
  ...props
}) => {
  const { lastEventSelected } = useSelector((state) => state.ui);

  return (
    <Chip
      classNames={{
        base: className,
        content: cn('flex items-center gap-1'),
      }}
      radius="sm"
      variant="faded"
      color="secondary"
      {...(lastEventSelected === eventName && { color: 'primary' })}
      {...props}
    >
      {eventName}
      <Icon icon="pricing" size={16} />
    </Chip>
  );
};
