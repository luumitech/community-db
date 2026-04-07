import { Select, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigureTickets,
  renderEmptyResult,
  renderItems,
} from '~/community/[communityId]/layout-util/render-select';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';

interface Props {
  className?: string;
}

export const TicketSelect: React.FC<Props> = ({ className }) => {
  const { communityId, visibleTicketItems } = useLayoutContext();
  const { ticketSelected } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const hasNoItem = visibleTicketItems.length === 0;

  return (
    <Select
      className={cn(className, 'max-w-xs min-w-32')}
      aria-label="Ticket Name"
      placeholder="Select ticket"
      selectedKeys={ticketSelected ? [ticketSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        dispatch(actions.ui.setTicketSelected(firstKey?.toString()));
      }}
    >
      <>
        {hasNoItem &&
          renderEmptyResult(
            <PleaseConfigureTickets communityId={communityId} />
          )}
        {renderItems(visibleTicketItems)}
      </>
    </Select>
  );
};
