import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  cn,
} from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { appLabel } from '~/lib/app-path';
import { decMul } from '~/lib/decimal-util';
import { insertIf } from '~/lib/insert-if';
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
  const { selectTicketSections, visibleTicketItems, ticketDefault } =
    useLayoutContext();

  const sections = includeHiddenFields
    ? selectTicketSections
    : [
        ...insertIf(visibleTicketItems.length > 0, {
          title: '',
          items: visibleTicketItems,
          showDivider: false,
        }),
      ];

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
        emptyContent={
          <div>
            Please configure ticket items in{' '}
            <span className="text-sm text-foreground-500">
              {appLabel('communityModify')}
            </span>
          </div>
        }
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
