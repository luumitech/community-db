import { cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem, SelectSection } from '~/view/base/select';

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { selectEventSections } = useAppContext();

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-sm')}
      controlName="membership.eventAttended.eventName"
      aria-label="Event Name"
      items={selectEventSections}
      variant="underlined"
      // placeholder="Select an event"
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
  );
};
