import { cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { insertIf } from '~/lib/insert-if';
import {
  Select,
  SelectItem,
  SelectSection,
  type SelectProps,
} from '~/view/base/select';

type CustomSelectProps = Omit<
  SelectProps,
  'controlName' | 'items' | 'children'
>;

interface Props extends CustomSelectProps {
  className?: string;
  controlNamePrefix: string;
  includeHiddenFields?: boolean;
}

export const TicketTypeSelect: React.FC<Props> = ({
  className,
  controlNamePrefix,
  includeHiddenFields,
  ...props
}) => {
  const { selectTicketSections, visibleTicketItems } = useAppContext();

  const items = includeHiddenFields
    ? selectTicketSections
    : [
        ...insertIf(visibleTicketItems.length > 0, {
          title: '',
          items: visibleTicketItems,
          showDivider: false,
        }),
      ];

  return (
    <div className={cn(className)}>
      <Select
        className="min-w-32 max-w-xs"
        controlName={`${controlNamePrefix}.ticketName`}
        aria-label="Ticket Name"
        items={items}
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
