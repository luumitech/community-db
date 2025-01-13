import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import React from 'react';
import { CurrencyInput } from '~/view/base/currency-input';
import { FlatButton } from '~/view/base/flat-button';
import { Input } from '~/view/base/input';

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
  ticketIdx: number;
  onRemove?: (label: string) => void;
}

export const VisibleListItem: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  id,
  label,
  ticketIdx,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ animateLayoutChanges, id });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'grid col-span-full grid-cols-subgrid',
        'mx-3 items-center'
      )}
      role="row"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <div role="cell">
        <FlatButton
          className="text-foreground-500 pr-2 cursor-grab active:cursor-grabbing"
          icon="drag-handle"
          {...attributes}
          {...listeners}
        />
      </div>
      <div role="cell">{label}</div>
      <CurrencyInput
        role="cell"
        controlName={`ticketList.${ticketIdx}.unitPrice`}
        aria-label="Unit Price"
        allowNegative={false}
        variant="underlined"
      />
      <Input
        role="cell"
        controlName={`ticketList.${ticketIdx}.count`}
        aria-label="Ticket #"
        variant="underlined"
        type="number"
        min={0}
      />
      <div role="cell">
        <FlatButton
          className="text-danger"
          icon="cross"
          onClick={() => onRemove?.(label)}
        />
      </div>
    </div>
  );
};
