import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';

// Enable animation when item is removed
const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

interface Props {
  className?: string;
  id: string;
  label: string;
  onRemove?: (label: string) => void;
}

export const VisibleListItem: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  id,
  label,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ animateLayoutChanges, id });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'grid col-span-full grid-cols-subgrid',
        'mx-3 items-center h-6'
      )}
      role="row"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <FlatButton
        className="text-foreground-500 pr-2 cursor-grab active:cursor-grabbing"
        icon="drag-handle"
        {...attributes}
        {...listeners}
      />
      <div className="text-sm">{label}</div>
      <FlatButton
        className="text-danger"
        icon="cross"
        onClick={() => onRemove?.(label)}
      />
    </div>
  );
};
