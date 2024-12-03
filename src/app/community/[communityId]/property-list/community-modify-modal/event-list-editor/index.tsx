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
  const eventList = useFieldArray({
    control,
    name: 'eventList',
  });
  const hiddenEventList = useFieldArray({
    control,
    name: 'hidden.eventList',
  });

  /**
   * Item can only be added if it is different than // the ones on the visible
   * list
   */
  const isItemValid = React.useCallback(
    (itemName: string) => {
      const allEvents = [...eventList.fields, ...hiddenEventList.fields];
      const found = allEvents.find(
        ({ name }) =>
          !name.localeCompare(itemName, undefined, { sensitivity: 'accent' })
      );
      return !found;
    },
    [eventList.fields, hiddenEventList.fields]
  );

  const addVisibleItem = React.useCallback(
    (itemName: string) => {
      eventList.append({ name: itemName });
    },
    [eventList]
  );

  const addIsDisabled = React.useMemo(() => {
    return !newItem || !isItemValid(newItem);
  }, [newItem, isItemValid]);

  const addNewItem = React.useCallback(() => {
    if (!addIsDisabled) {
      addVisibleItem(newItem);
      setNewItem('');
    }
  }, [newItem, addVisibleItem, addIsDisabled]);

  const addHiddenItem = React.useCallback(
    (itemName: string) => {
      hiddenEventList.append({ name: itemName });
    },
    [hiddenEventList]
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
          <VisibleList fieldArray={eventList} onRemove={addHiddenItem} />
          <HiddenList fieldArray={hiddenEventList} onRemove={addVisibleItem} />
        </div>
      </CardBody>
      <CardFooter className="gap-2 items-start">
        <Input
          className="max-w-xs"
          aria-label="New event name"
          placeholder="Enter new event name"
          value={newItem}
          onValueChange={setNewItem}
          errorMessage="Event name must be unique"
          isInvalid={!isItemValid(newItem)}
        />
        <Button
          className="text-primary"
          endContent={<Icon icon="add" />}
          variant="faded"
          onClick={addNewItem}
          isDisabled={addIsDisabled}
        >
          Add Event
        </Button>
      </CardFooter>
    </Card>
  );
};
