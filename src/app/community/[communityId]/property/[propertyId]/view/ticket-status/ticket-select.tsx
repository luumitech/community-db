import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { PleaseConfigureTickets } from '~/community/[communityId]/layout-util/render-select';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { PlainSelect } from '~/view/base/select';

interface Props {
  className?: string;
}

export const TicketSelect: React.FC<Props> = ({ className }) => {
  const { communityId, visibleTicketItems } = useLayoutContext();
  const { ticketSelected } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const emptyContent = React.useMemo(() => {
    return <PleaseConfigureTickets communityId={communityId} />;
  }, [communityId]);

  return (
    <PlainSelect
      className={cn(className, 'max-w-xs min-w-32')}
      aria-label="Ticket Name"
      placeholder="Select ticket"
      items={visibleTicketItems}
      emptyContent={emptyContent}
      selectedKeys={ticketSelected ? [ticketSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        dispatch(actions.ui.setTicketSelected(firstKey?.toString()));
      }}
    />
  );
};
