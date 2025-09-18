import { Dropdown, DropdownMenu, DropdownTrigger, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigureTickets,
  renderDropdownItems,
  renderDropdownSections,
} from '~/community/[communityId]/layout-util/render-select';
import { decMul } from '~/lib/decimal-util';
import { FlatButton } from '~/view/base/flat-button';
import { Ticket } from './_type';

interface Props {
  className?: string;
  /**
   * When displaying select items, include hidden fields as well, applicable to:
   *
   * - Payment Methods
   * - Event Names
   */
  includeHiddenFields?: boolean;
  onClick?: (ticket: Ticket) => void;
}

export const TicketAddButton: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  includeHiddenFields,
  onClick,
  children,
}) => {
  const {
    communityId,
    selectTicketSections,
    visibleTicketItems,
    ticketDefault,
  } = useLayoutContext();

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        {children ?? (
          <FlatButton
            className={cn(className, 'text-primary')}
            icon="add-ticket"
            tooltip="Add Ticket"
          />
        )}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Add ticket item"
        emptyContent={<PleaseConfigureTickets communityId={communityId} />}
        onAction={(key) => {
          const ticketName = key as string;
          const ticketDef = ticketDefault.get(ticketName);
          onClick?.({
            ticketName,
            count: ticketDef?.count ?? null,
            price: decMul(ticketDef?.unitPrice, ticketDef?.count) ?? null,
            paymentMethod: null,
          });
        }}
      >
        {includeHiddenFields
          ? renderDropdownSections(selectTicketSections)
          : renderDropdownItems(visibleTicketItems)}
      </DropdownMenu>
    </Dropdown>
  );
};
