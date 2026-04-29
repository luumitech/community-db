import React from 'react';
import { TicketChip } from '~/community/[communityId]/common/chip/';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { type SelectItemT } from '~/community/[communityId]/layout-util/community-context';
import { Select, type SelectProps } from '~/view/base/select';

type CustomProps = Omit<SelectProps<SelectItemT>, 'items'>;

interface Props extends CustomProps {
  className?: string;
}

export const TicketSelect: React.FC<Props> = ({ className, ...props }) => {
  const { visibleTicketItems } = useLayoutContext();

  const renderValue = React.useCallback((items: SelectItemT[]) => {
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
      items={visibleTicketItems}
      renderValue={renderValue}
      {...props}
    />
  );
};
