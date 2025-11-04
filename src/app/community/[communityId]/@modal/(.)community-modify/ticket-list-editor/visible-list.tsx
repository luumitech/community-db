import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ReorderGroup, ReorderItem } from '~/view/base/drag-reorder';
import { type TicketListFieldArray } from '../use-hook-form';
import { VisibleListItem } from './visible-list-item';

interface Props {
  className?: string;
  fieldArray: TicketListFieldArray;
  onRemove?: (label: string) => void;
}

export const VisibleList: React.FC<Props> = ({
  className,
  fieldArray,
  onRemove,
}) => {
  const { fields, move, remove } = fieldArray;

  const removeItem = React.useCallback(
    (label: string, idx: number) => {
      onRemove?.(label);
      remove(idx);
    },
    [remove, onRemove]
  );

  return (
    <ReorderGroup axis="vertical" items={fields} onMove={move}>
      {fields.map((field, index) => (
        <ReorderItem
          key={field.id}
          id={field.id}
          className={twMerge('col-span-full grid grid-cols-subgrid', className)}
        >
          <VisibleListItem
            label={field.name}
            ticketIdx={index}
            onRemove={(label) => removeItem(label, index)}
          />
        </ReorderItem>
      ))}
    </ReorderGroup>
  );
};
