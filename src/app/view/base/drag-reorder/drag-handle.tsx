import { cn } from '@heroui/react';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { useReorderItemContext } from './reorder-item';

interface Props {
  className?: string;
}

export const DragHandle: React.FC<Props> = ({ className }) => {
  const { sortable } = useReorderItemContext();
  const { attributes, listeners } = sortable;

  return (
    <FlatButton
      className={cn(
        'text-foreground-500',
        'cursor-grab active:cursor-grabbing',
        className
      )}
      icon="drag-handle"
      {...attributes}
      {...listeners}
    />
  );
};
