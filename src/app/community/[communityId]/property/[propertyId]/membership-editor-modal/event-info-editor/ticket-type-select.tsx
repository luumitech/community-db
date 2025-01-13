import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  Select,
  SelectItem,
  SelectProps,
  SelectSection,
} from '~/view/base/select';

type CustomSelectProps = Omit<
  SelectProps,
  'controlName' | 'items' | 'children'
>;

interface Props extends CustomSelectProps {
  className?: string;
  yearIdx: number;
  eventIdx: number;
  ticketIdx: number;
}

export const TicketTypeSelect: React.FC<Props> = ({
  className,
  yearIdx,
  eventIdx,
  ticketIdx,
  ...props
}) => {
  const { selectTicketSections } = useAppContext();

  return (
    <div className={clsx(className)}>
      <Select
        className="max-w-sm"
        controlName={`membershipList.${yearIdx}.eventAttendedList.${eventIdx}.ticketList.${ticketIdx}.ticketName`}
        aria-label="Ticket Name"
        items={selectTicketSections}
        variant="underlined"
        selectionMode="single"
        {...props}
      >
        {(section) => (
          <SelectSection
            key={section.title}
            title={section.title}
            items={section.items}
            showDivider={section.showDivider}
          >
            {(item) => (
              <SelectItem key={item.value} textValue={item.label}>
                {item.label}
              </SelectItem>
            )}
          </SelectSection>
        )}
      </Select>
    </div>
  );
};
