import { Select, SelectItem } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useContext } from '~/community/[communityId]/context';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';

interface Props {
  className?: string;
}

export const EventDefaultSelect: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const lastEventSelected = useSelector((state) => state.ui.lastEventSelected);
  const { addEventItems } = useContext();

  return (
    <Select
      className={clsx(className, 'max-w-sm')}
      aria-label="Event Name"
      items={addEventItems}
      variant="underlined"
      placeholder="Select event to add"
      defaultSelectedKeys={lastEventSelected ? [lastEventSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        dispatch(
          actions.ui.setLastEventSelected(firstKey?.toString() ?? undefined)
        );
      }}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
