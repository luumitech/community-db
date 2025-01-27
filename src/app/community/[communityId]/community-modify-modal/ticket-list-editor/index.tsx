import { Button, Input } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from '../use-hook-form';
import { HiddenList } from './hidden-list';
import { RowHeader } from './row-header';
import { VisibleList } from './visible-list';

interface Props {
  className?: string;
}

export const TicketListEditor: React.FC<Props> = ({ className }) => {
  const [newItem, setNewItem] = React.useState<string>('');
  const { control } = useHookFormContext();
  const ticketList = useFieldArray({
    control,
    name: 'ticketList',
  });
  const hiddenTicketList = useFieldArray({
    control,
    name: 'hidden.ticketList',
  });

  /** Item can only be added if it is different than the ones on the visible list */
  const isItemValid = React.useCallback(
    (itemName: string) => {
      const nameList = [...ticketList.fields, ...hiddenTicketList.fields];
      const found = nameList.find(
        ({ name }) =>
          !name.localeCompare(itemName, undefined, { sensitivity: 'accent' })
      );
      return !found;
    },
    [ticketList.fields, hiddenTicketList.fields]
  );

  const addVisibleItem = React.useCallback(
    (itemName: string) => {
      ticketList.append({ name: itemName, count: null, unitPrice: null });
    },
    [ticketList]
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
      hiddenTicketList.append({ name: itemName });
    },
    [hiddenTicketList]
  );

  return (
    <div className={clsx(className, 'flex flex-col gap-4')}>
      <div className="grid grid-cols-[40px_repeat(3,1fr)_75px] gap-y-2 gap-x-4">
        <RowHeader />
        <VisibleList fieldArray={ticketList} onRemove={addHiddenItem} />
        <HiddenList fieldArray={hiddenTicketList} onRemove={addVisibleItem} />
      </div>
      <div className="flex gap-2 items-start">
        <Input
          className="max-w-xs"
          label="New ticket type"
          value={newItem}
          onValueChange={setNewItem}
          errorMessage="Ticket type must be unique"
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
      {hiddenTicketList.fields.length > 0 && (
        <p className="text-sm">
          <span className="font-semibold">NOTE:</span> Removed ticket names will
          not be shown in ticket selection list. The removed names will remain
          in the database until they are no longer being referenced.
        </p>
      )}
    </div>
  );
};
