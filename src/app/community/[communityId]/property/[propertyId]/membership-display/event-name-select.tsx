import { Select, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigureEvents,
  renderEmptyResult,
  renderItems,
} from '~/community/[communityId]/layout-util/render-select';

import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { getCurrentDate } from '~/lib/date-util';

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { communityId, visibleEventItems } = useLayoutContext();
  const { lastEventSelected } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const hasNoItem = visibleEventItems.length === 0;

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      aria-label="Current Event Name"
      placeholder="Select current event"
      description={getCurrentDate()}
      selectedKeys={lastEventSelected ? [lastEventSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        dispatch(actions.ui.setLastEventSelected(firstKey?.toString()));
      }}
    >
      <>
        {hasNoItem &&
          renderEmptyResult(
            <PleaseConfigureEvents communityId={communityId} />
          )}
        {renderItems(visibleEventItems)}
      </>
    </Select>
  );
};
