import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from '@nextui-org/react';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from '../use-hook-form';
import { HiddenList } from './hidden-list';
import { VisibleList } from './visible-list';

interface Props {
  className?: string;
}

export const EventListEditor: React.FC<Props> = ({ className }) => {
  const [newItem, setNewItem] = React.useState<string>('');
  const { control } = useHookFormContext();
  const eventListMethods = useFieldArray({
    control,
    name: 'eventList',
  });
  const hiddenEventListMethods = useFieldArray({
    control,
    name: 'hiddenEventList',
  });

  /**
   * Item can only be added if it is different than
  // the ones on the visible list
   */
  const isItemValid = React.useCallback(
    (itemName: string) => {
      const allEvents = [
        ...eventListMethods.fields,
        ...hiddenEventListMethods.fields,
      ];
      const found = allEvents.find(
        ({ name }) =>
          !name.localeCompare(itemName, undefined, { sensitivity: 'accent' })
      );
      return !found;
    },
    [eventListMethods.fields, hiddenEventListMethods.fields]
  );

  const addVisibleItem = React.useCallback(
    (itemName: string) => {
      eventListMethods.append({ name: itemName });
    },
    [eventListMethods]
  );

  const addNewEventItem = React.useCallback(() => {
    if (isItemValid(newItem)) {
      addVisibleItem(newItem);
      setNewItem('');
    }
  }, [newItem, addVisibleItem, isItemValid]);

  const addHiddenItem = React.useCallback(
    (itemName: string) => {
      hiddenEventListMethods.append({ name: itemName });
    },
    [hiddenEventListMethods]
  );

  return (
    <Card shadow="none" className="border-2">
      <CardHeader>
        <div className="flex flex-col text-foreground-500">
          <p className="text-small">Event List</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex items-start gap-4">
          <VisibleList
            fieldMethod={eventListMethods}
            onRemove={addHiddenItem}
          />
          <HiddenList
            fieldMethod={hiddenEventListMethods}
            onRemove={addVisibleItem}
          />
        </div>
      </CardBody>
      <CardFooter className="min-h-[48px] mt-1">
        <div className="flex items-start gap-2">
          <Input
            aria-label="New event name"
            placeholder="Enter new event name"
            value={newItem}
            onValueChange={setNewItem}
            errorMessage="Event name must be unique"
            isInvalid={!isItemValid(newItem)}
          />
          <div>
            <Button
              onClick={addNewEventItem}
              endContent={<Icon icon="add" />}
              isDisabled={!newItem || !isItemValid(newItem)}
            >
              Add Event
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
