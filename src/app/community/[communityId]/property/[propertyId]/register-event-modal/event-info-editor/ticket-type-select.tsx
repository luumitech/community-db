import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem, SelectProps } from '~/view/base/select';

type CustomSelectProps = Omit<
  SelectProps,
  'controlName' | 'items' | 'children'
>;

interface Props extends CustomSelectProps {
  className?: string;
  ticketIdx: number;
}

export const TicketTypeSelect: React.FC<Props> = ({
  className,
  ticketIdx,
  ...props
}) => {
  const { visibleTicketItems } = useAppContext();

  return (
    <div className={clsx(className)}>
      <Select
        className="max-w-sm"
        controlName={`event.ticketList.${ticketIdx}.ticketName`}
        aria-label="Ticket Name"
        items={visibleTicketItems}
        variant="underlined"
        selectionMode="single"
        {...props}
      >
        {(item) => (
          <SelectItem key={item.value} textValue={item.label}>
            {item.label}
          </SelectItem>
        )}
      </Select>
    </div>
  );
};
