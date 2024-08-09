import { DndContext, DragEndEvent, MeasuringStrategy } from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { type PaymentMethodListFieldArray } from '../use-hook-form';
import { VisibleListItem } from './visible-list-item';

interface Props {
  className?: string;
  fieldArray: PaymentMethodListFieldArray;
  onRemove?: (label: string) => void;
}

export const VisibleList: React.FC<Props> = ({
  className,
  fieldArray,
  onRemove,
}) => {
  const { fields, move, remove } = fieldArray;

  const reorderList = React.useCallback(
    (evt: DragEndEvent) => {
      const { active, over } = evt;
      if (!over) {
        return;
      }

      if (active.id !== over.id) {
        const activeIndex = active.data.current?.sortable?.index;
        const overIndex = over.data.current?.sortable?.index;
        if (activeIndex != null && overIndex != null) {
          move(activeIndex, overIndex);
        }
      }
    },
    [move]
  );

  const removeItem = React.useCallback(
    (label: string, idx: number) => {
      onRemove?.(label);
      remove(idx);
    },
    [remove, onRemove]
  );

  return (
    <DndContext
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      // Lock to vertical axis
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      onDragEnd={reorderList}
    >
      <SortableContext items={fields} strategy={verticalListSortingStrategy}>
        <ul className="grid auto-cols-max gap-1">
          {fields.map((field, index) => (
            <VisibleListItem
              key={field.id}
              id={field.id}
              label={field.name}
              onRemove={(label) => removeItem(label, index)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
