import { Input, cn } from '@heroui/react';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from '../use-hook-form';
import { HiddenList } from './hidden-list';
import { RowHeader } from './row-header';
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
      const nameList = [...eventList.fields, ...hiddenEventList.fields];
      const found = nameList.find(
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
    <div className={cn(className, 'flex flex-col gap-4')}>
      <div className="grid grid-cols-[40px_repeat(1,1fr)_75px] gap-2">
        <RowHeader />
        <VisibleList fieldArray={eventList} onRemove={addHiddenItem} />
        <HiddenList fieldArray={hiddenEventList} onRemove={addVisibleItem} />
      </div>
      <div className="flex items-start gap-2">
        <Input
          className="max-w-xs"
          label="New event name"
          value={newItem}
          onValueChange={setNewItem}
          errorMessage="Event name must be unique"
          isInvalid={!isItemValid(newItem)}
        />
        <Button
          className="h-14"
          variant="bordered"
          color="primary"
          endContent={<Icon icon="add" />}
          onPress={addNewItem}
          isDisabled={addIsDisabled}
        >
          Add
        </Button>
      </div>
      {hiddenEventList.fields.length > 0 && (
        <p className="text-sm">
          <span className="font-semibold">NOTE:</span> Removed events will not
          be shown in event selection list or dashboard. The removed events will
          remain in the database until they are no longer being referenced.
        </p>
      )}
    </div>
  );
};
