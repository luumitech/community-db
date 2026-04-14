import { Chip, ChipProps, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props extends ChipProps {
  className?: string;
  ticketName: string;
}

export const TicketChip: React.FC<Props> = ({
  className,
  ticketName,
  ...props
}) => {
  return (
    <Chip className={className} radius="sm" variant="faded" {...props}>
      <div className="flex items-center gap-1">
        {ticketName}
        <Icon icon="ticket" size={16} />
      </div>
    </Chip>
  );
};
