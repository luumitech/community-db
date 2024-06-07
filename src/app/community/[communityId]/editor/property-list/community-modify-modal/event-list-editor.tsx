import { DndContext, DragEndEvent, MeasuringStrategy } from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from '@nextui-org/react';
import React from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { EventListItem } from './event-list-item';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const EventListEditor: React.FC<Props> = ({ className }) => {
  const [newItem, setNewItem] = React.useState<string>('');
  const { watch, setValue } = useHookFormContext();
  const eventList = watch('eventList');

  const reorderList = React.useCallback(
    (e: DragEndEvent) => {
      if (!e.over) return;

      if (e.active.id !== e.over.id) {
        const oldIdx = eventList.indexOf(e.active.id.toString());
        const newIdx = eventList.indexOf(e.over!.id.toString());
        const newEventList = arrayMove(eventList, oldIdx, newIdx);
        setValue('eventList', newEventList, { shouldDirty: true });
      }
    },
    [eventList, setValue]
  );

  const newItemAlreadyExists = eventList.includes(newItem);

  const addItem = React.useCallback(() => {
    if (!newItemAlreadyExists) {
      setValue('eventList', [...eventList, newItem], { shouldDirty: true });
      setNewItem('');
    }
  }, [newItemAlreadyExists, eventList, setValue, newItem]);

  const removeItem = React.useCallback(
    (itemToRemove: string) => {
      const newEventList = eventList.filter(
        (evtName) => evtName !== itemToRemove
      );
      setValue('eventList', newEventList, { shouldDirty: true });
    },
    [eventList, setValue]
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
      <SortableContext items={eventList} strategy={verticalListSortingStrategy}>
        <Card shadow="none" className="border-2">
          <CardHeader>
            <div className="flex flex-col text-foreground-500">
              <p className="text-small">Event List</p>
            </div>
          </CardHeader>
          <CardBody>
            <ul className="grid auto-cols-max gap-1">
              {eventList.map((eventName) => (
                <EventListItem
                  key={eventName}
                  label={eventName}
                  onRemove={removeItem}
                />
              ))}
            </ul>
          </CardBody>
          <CardFooter>
            <div className="flex items-start gap-2">
              <Input
                aria-label="New event name"
                placeholder="New event name"
                value={newItem}
                onValueChange={setNewItem}
                errorMessage="Event name must be unique"
                isInvalid={newItemAlreadyExists}
              />
              <div>
                <Button
                  onClick={addItem}
                  endContent={<IoMdAddCircleOutline />}
                  isDisabled={newItemAlreadyExists}
                >
                  Add Event
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </SortableContext>
    </DndContext>
  );
};
