import { Chip, cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
}

export const OwnerChip: React.FC<Props> = ({ className }) => {
  return (
    <Chip
      className={className}
      radius="sm"
      size="sm"
      variant="flat"
      color="secondary"
    >
      owner
    </Chip>
  );
};
