import React from 'react';
import { twMerge } from 'tailwind-merge';
import * as GQL from '~/graphql/generated/graphql';
import { createSelect, type SelectItem } from '~/view/base/select';
import { type InputData } from '../use-hook-form';

const Select = createSelect<InputData>();

const methodItems: SelectItem[] = [
  {
    key: GQL.BatchModifyMethod.AddEvent,
    textValue: 'Add an event or update membership',
  },
  {
    key: GQL.BatchModifyMethod.AddGps,
    textValue: 'Update GPS Information for properties',
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
    />
  );
};
