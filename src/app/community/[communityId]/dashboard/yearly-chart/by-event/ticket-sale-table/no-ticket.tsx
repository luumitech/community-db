import { CardBody, cn } from '@heroui/react';
import React from 'react';

export interface Props {
  className?: string;
}

export const NoTicket: React.FC<Props> = ({ className }) => {
  return (
    <CardBody
      className={cn(className, 'text-center text-sm text-foreground-500')}
    >
      No data to display
    </CardBody>
  );
};
