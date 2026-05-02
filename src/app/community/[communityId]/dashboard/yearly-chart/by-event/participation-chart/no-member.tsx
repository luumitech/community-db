import { cn } from '@heroui/react';
import React from 'react';
import { Card } from '~/view/base/card';

interface Props {
  className?: string;
}

export const NoMember: React.FC<Props> = ({ className }) => {
  return (
    <Card.Body
      className={cn(className, 'text-center text-sm text-foreground/60')}
    >
      No data to display
    </Card.Body>
  );
};
