import { Chip, ChipProps } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

interface Props extends ChipProps {
  className?: string;
  eventName: string;
}

export const EventChip: React.FC<Props> = ({
  className,
  eventName,
  ...props
}) => {
  const { communityUi } = useAppContext();
  const { lastEventSelected } = communityUi;

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
