import React from 'react';
import { twMerge } from 'tailwind-merge';
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
      className={twMerge(
        'col-span-full grid grid-cols-subgrid',
        'mx-3 h-6 items-center',
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
