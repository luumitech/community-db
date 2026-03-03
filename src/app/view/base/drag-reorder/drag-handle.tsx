import React from 'react';
import { twMerge } from 'tailwind-merge';
import { FlatButton } from '~/view/base/flat-button';
import { useReorderItemContext } from './reorder-item';

interface Props {
  className?: string;
}

export const DragHandle: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  const { sortable } = useReorderItemContext();
  const { attributes, listeners } = sortable;

  return (
    <div
      className={twMerge(
        'text-foreground-500',
        'cursor-grab active:cursor-grabbing',
        className
      )}
      {...attributes}
      {...listeners}
    >
      <FlatButton
        className="cursor-grab active:cursor-grabbing"
        icon="drag-handle"
      />
      {children}
    </div>
  );
};
