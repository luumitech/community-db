import { DndContext, DragEndEvent, MeasuringStrategy } from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
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
import { useFieldArray } from '~/custom-hooks/hook-form';
import { EventListItem } from './event-list-item';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const EventListEditor: React.FC<Props> = ({ className }) => {
  const [newItem, setNewItem] = React.useState<string>('');
  const { control } = useHookFormContext();
  const { fields, remove, append, move } = useFieldArray({
    control,
    name: 'eventList',
  });

  const reorderList = React.useCallback(
    (evt: DragEndEvent) => {
      const { active, over } = evt;
      if (!over) return;

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

  // New item can only be added if it is different than
  // the ones on the existing list
  const newItemIsValid = !fields.find(
    ({ name }) =>
      !name.localeCompare(newItem, undefined, { sensitivity: 'accent' })
  );

  const addItem = React.useCallback(() => {
    if (newItemIsValid) {
      append({ name: newItem, hidden: false });
      setNewItem('');
    }
  }, [append, newItemIsValid, newItem]);

  const removeItem = React.useCallback(
    (idx: number) => {
      remove(idx);
    },
    [remove]
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
        <Card shadow="none" className="border-2">
          <CardHeader>
            <div className="flex flex-col text-foreground-500">
              <p className="text-small">Event List</p>
            </div>
          </CardHeader>
          <CardBody>
            <ul className="grid auto-cols-max gap-1">
              {fields.map((field, index) => (
                <EventListItem
                  key={field.id}
                  id={field.id}
                  label={field.name}
                  onRemove={() => removeItem(index)}
                />
              ))}
            </ul>
          </CardBody>
          <CardFooter>
            <div className="flex items-start gap-2">
              <Input
                aria-label="New event name"
                placeholder="Enter new event name"
                value={newItem}
                onValueChange={setNewItem}
                errorMessage="Event name must be unique"
                isInvalid={!newItemIsValid}
              />
              <div>
                <Button
                  onClick={addItem}
                  endContent={<IoMdAddCircleOutline />}
                  isDisabled={!newItem || !newItemIsValid}
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
