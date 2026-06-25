import { Chip, cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
}

export const YouChip: React.FC<Props> = ({ className }) => {
  return (
    <Chip
      className={className}
      radius="sm"
      size="sm"
      variant="bordered"
      color="primary"
    >
      you
    </Chip>
  );
};
