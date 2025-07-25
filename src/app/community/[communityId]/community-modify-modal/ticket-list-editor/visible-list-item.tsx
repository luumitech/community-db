import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@heroui/react';
import React from 'react';
import { CurrencyInput } from '~/view/base/currency-input';
import { FlatButton } from '~/view/base/flat-button';
import { NumberInput } from '~/view/base/number-input';

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
      className={cn('grid col-span-full grid-cols-subgrid', 'mx-3 items-start')}
      role="row"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <FlatButton
        className={cn(
          'text-foreground-500 mt-3',
          'cursor-grab active:cursor-grabbing'
        )}
        icon="drag-handle"
        {...attributes}
        {...listeners}
      />
      <div className="text-sm mt-3">{label}</div>
      <CurrencyInput
        controlName={`ticketList.${ticketIdx}.unitPrice`}
        aria-label="Unit Price"
        allowNegative={false}
        variant="underlined"
      />
      <NumberInput
        controlName={`ticketList.${ticketIdx}.count`}
        aria-label="Ticket #"
        labelPlacement="outside"
        variant="underlined"
        hideStepper
        isWheelDisabled
      />
      <FlatButton
        className="text-danger mt-3"
        icon="cross"
        onClick={() => onRemove?.(label)}
      />
    </div>
  );
};
