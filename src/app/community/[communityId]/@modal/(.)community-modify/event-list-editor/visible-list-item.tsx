import { cn } from '@heroui/react';
import React from 'react';
import { DragHandle } from '~/view/base/drag-reorder';
import { FlatButton } from '~/view/base/flat-button';

interface Props {
  className?: string;
  label: string;
  onRemove?: (label: string) => void;
}

export const VisibleListItem: React.FC<Props> = ({
  className,
  label,
  onRemove,
}) => {
  return (
    <div
      className={cn(
        'grid col-span-full grid-cols-subgrid',
        'mx-3 items-center h-6',
        className
      )}
      role="row"
    >
      <DragHandle />
      <div className="text-sm">{label}</div>
      <FlatButton
        className="text-danger"
        icon="cross"
        onClick={() => onRemove?.(label)}
      />
    </div>
  );
};
