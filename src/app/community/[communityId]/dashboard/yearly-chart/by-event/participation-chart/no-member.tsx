import { CardBody, cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
}

export const NoMember: React.FC<Props> = ({ className }) => {
  return (
    <CardBody
      className={cn(className, 'text-center text-sm text-foreground/60')}
    >
      No data to display
    </CardBody>
  );
};
