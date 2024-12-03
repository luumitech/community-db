import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem } from '~/view/base/select';
import { useHookFormContext } from '../use-hook-form';

interface Props {
  className?: string;
}

export const EventSelect: React.FC<Props> = ({ className }) => {
  const { visibleEventItems } = useAppContext();
  const { register } = useHookFormContext();

  return (
    <Select
      classNames={{
        base: className,
      }}
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
