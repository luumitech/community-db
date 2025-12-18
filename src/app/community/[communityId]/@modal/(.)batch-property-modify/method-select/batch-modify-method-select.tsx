import React from 'react';
import { twMerge } from 'tailwind-merge';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem } from '~/view/base/select';

const methodItems = [
  {
    label: 'Add an event or update membership',
    value: GQL.BatchModifyMethod.AddEvent,
  },
  {
    label: 'Update GPS Information for properties',
    value: GQL.BatchModifyMethod.AddGps,
  },
];

interface Props {
  className?: string;
}

export const BatchModifyMethodSelect: React.FC<Props> = ({ className }) => {
  return (
    <Select
      className={twMerge('max-w-xs min-w-32', className)}
      controlName="method"
      label="Type of modification"
      items={methodItems}
      isDisabled={!methodItems.length}
      selectionMode="single"
      disallowEmptySelection
      autoFocus
    >
      {(item) => {
        return (
          <SelectItem key={item.value} textValue={item.label}>
            <div>{item.label}</div>
          </SelectItem>
        );
      }}
    </Select>
  );
};
