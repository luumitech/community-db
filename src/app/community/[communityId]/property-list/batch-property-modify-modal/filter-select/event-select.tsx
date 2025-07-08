import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { Select, SelectItem } from '~/view/base/select';
import { useHookFormContext } from '../use-hook-form';

interface Props {
  className?: string;
}

export const EventSelect: React.FC<Props> = ({ className }) => {
  const { visibleEventItems } = useLayoutContext();
  const { register } = useHookFormContext();

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      controlName="filter.memberEvent"
      size="sm"
      label="Membership Event"
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
