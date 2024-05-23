import { Select, SelectItem } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { supportedEvents } from './events-attended-select';

interface Props {
  className?: string;
}

export const EventDefaultSelect: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const lastEventSelected = useSelector((state) => state.ui.lastEventSelected);

  return (
    <Select
      className={clsx(className, 'max-w-sm')}
      label="Event Name"
      items={supportedEvents}
      placeholder="Select event to add"
      defaultSelectedKeys={lastEventSelected ? [lastEventSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        dispatch(
          actions.ui.setLastEventSelected(firstKey?.toString() ?? undefined)
        );
      }}
    >
      {(entry) => (
        <SelectItem key={entry.value} textValue={entry.label}>
          {entry.label}
        </SelectItem>
      )}
    </Select>
  );
};
