import { cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem } from '~/view/base/select';

interface Props {
  className?: string;
}

export const EventSelect: React.FC<Props> = ({ className }) => {
  const { visibleEventItems } = useAppContext();

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      controlName="filter.memberEvent"
      size="sm"
      label="Membership Event"
      description="Include only members who registered at the specified event"
      items={visibleEventItems}
      selectionMode="single"
      // disallowEmptySelection
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
