import { Chip, ChipProps } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';

interface Props extends ChipProps {
  className?: string;
  eventName: string;
}

export const EventChip: React.FC<Props> = ({
  className,
  eventName,
  ...props
}) => {
  const { lastEventSelected } = useSelector((state) => state.ui);

  return (
    <Chip
      className={className}
      radius="sm"
      variant="flat"
      color="secondary"
      {...(lastEventSelected === eventName && { color: 'primary' })}
      {...props}
    >
      {eventName}
    </Chip>
  );
};
