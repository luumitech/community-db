import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { calcPrice } from '~/lib/decimal-util';
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

export const TicketAddButton: React.FC<Props> = ({
  className,
  includeHiddenFields,
  onClick,
}) => {
  const { selectTicketSections, visibleTicketItems, ticketDefault } =
    useAppContext();

  const sections = includeHiddenFields
    ? selectTicketSections
    : [{ title: '', items: visibleTicketItems, showDivider: false }];

  return (
    <Dropdown>
      <DropdownTrigger>
        <FlatButton
          className={clsx(className, 'text-primary')}
          icon="add-ticket"
          tooltip="Add Ticket"
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Add ticket item"
        onAction={(key) => {
          const ticketName = key as string;
          const ticketDef = ticketDefault.get(ticketName);
          onClick?.({
            ticketName,
            count: ticketDef?.count ?? null,
            price: calcPrice(ticketDef?.unitPrice, ticketDef?.count) ?? null,
            paymentMethod: null,
          });
        }}
      >
        {sections.map((section, idx) => (
          <DropdownSection
            key={idx}
            title={section.title}
            showDivider={section.showDivider}
          >
            {section.items.map((item) => (
              <DropdownItem key={item.value}>{item.label}</DropdownItem>
            ))}
          </DropdownSection>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
