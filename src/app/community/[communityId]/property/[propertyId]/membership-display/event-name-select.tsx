import { Select, SelectItem, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';

import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { getCurrentDate } from '~/lib/date-util';

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { visibleEventItems } = useLayoutContext();
  const { lastEventSelected } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      aria-label="Current Event Name"
      items={visibleEventItems}
      placeholder="Select current event"
      description={getCurrentDate()}
      selectedKeys={lastEventSelected ? [lastEventSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        dispatch(actions.ui.setLastEventSelected(firstKey?.toString()));
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
