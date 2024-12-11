import { Chip, ChipProps } from '@nextui-org/react';
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
      {...(lastEventSelected === eventName && { color: 'primary' })}
      variant="faded"
      {...props}
    >
      {eventName}
    </Chip>
  );
};
