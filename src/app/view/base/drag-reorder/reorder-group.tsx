import { DndContext, DragEndEvent, MeasuringStrategy } from '@dnd-kit/core';
import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  type SortableContextProps,
} from '@dnd-kit/sortable';
import React from 'react';

interface Props extends SortableContextProps {
  axis: 'horizontal' | 'vertical';
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
        axis === 'horizontal'
          ? restrictToHorizontalAxis
          : restrictToVerticalAxis,
        restrictToWindowEdges,
      ]}
      onDragEnd={reorderList}
    >
      <SortableContext
        strategy={
          axis === 'horizontal'
            ? horizontalListSortingStrategy
            : verticalListSortingStrategy
        }
        {...props}
      />
    </DndContext>
  );
};
