import React from 'react';
import { TicketChip } from '~/community/[communityId]/common/chip/';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { renderItems } from '~/community/[communityId]/layout-util/render-select';
import {
  Select,
  type SelectProps,
  type SelectedItems,
} from '~/view/base/select';

type TicketItem = ReturnType<
  typeof useLayoutContext
>['visibleTicketItems'][number];

type CustomProps = Omit<SelectProps<TicketItem>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const TicketSelect: React.FC<Props> = ({ className, ...props }) => {
  const { visibleTicketItems } = useLayoutContext();

  const renderValue = React.useCallback((items: SelectedItems<TicketItem>) => {
    return (
      <div className="flex flex-wrap items-center gap-1">
        {items.map((item) => (
          <TicketChip key={item.key} ticketName={item.textValue ?? ''} />
        ))}
      </div>
    );
  }, []);

  const hasNoItems = visibleTicketItems.length === 0;

  return (
    <Select
      classNames={{
        base: className,
      }}
      label="Ticket Name(s)"
      selectionMode="multiple"
      isMultiline
      isDisabled={hasNoItems}
      placeholder="Unspecified"
      renderValue={renderValue}
      {...props}
    >
      {renderItems(visibleTicketItems)}
    </Select>
  );
};
