import { DndContext, DragEndEvent, MeasuringStrategy } from '@dnd-kit/core';
import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  verticalListSortingStrategy,
  type SortableContextProps,
} from '@dnd-kit/sortable';
import React from 'react';
import { insertIf } from '~/lib/insert-if';

interface Props extends SortableContextProps {
  /**
   * Lock drag axis
   *
   * - None: allow free movement
   * - Horizontal: lock movement on horizontal axis
   * - Vertical: lock movement on vertical axis
   */
  axis: 'none' | 'horizontal' | 'vertical';
  onMove?: (fromIdx: number, toIdx: number) => void;
}

export const ReorderGroup: React.FC<React.PropsWithChildren<Props>> = ({
  axis,
  onMove,
  ...props
}) => {
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
          onMove?.(activeIndex, overIndex);
        }
      }
    },
    [onMove]
  );

  return (
    <DndContext
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      // Lock to vertical axis
      modifiers={[
        ...insertIf(axis === 'horizontal', restrictToHorizontalAxis),
        ...insertIf(axis === 'vertical', restrictToVerticalAxis),
        restrictToWindowEdges,
      ]}
      onDragEnd={reorderList}
    >
      <SortableContext
        {...(axis === 'none' && {
          strategy: rectSortingStrategy,
        })}
        {...(axis === 'horizontal' && {
          strategy: horizontalListSortingStrategy,
        })}
        {...(axis === 'vertical' && {
          strategy: verticalListSortingStrategy,
        })}
        {...props}
      />
    </DndContext>
  );
};
