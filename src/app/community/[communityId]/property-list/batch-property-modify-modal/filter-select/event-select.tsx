import { Select, SelectItem } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
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
      size="sm"
      label="Membership Event"
      aria-label="Membership Event"
      items={visibleEventItems}
      selectionMode="single"
      // disallowEmptySelection
      {...register(`filter.memberEvent`)}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
