import React from 'react';
import { SelectProps, createSelect, type SelectItem } from '~/view/base/select';
import type { InputData } from '../use-hook-form';

const items: SelectItem[] = [
  {
    key: true.toString(),
    textValue: 'Opt-Out',
  },
  {
    key: false.toString(),
    textValue: 'Not Opt-Out',
  },
];

type CustomProps = Omit<SelectProps, 'controlName' | 'items'>;
const Select = createSelect<InputData>();

interface Props extends CustomProps {
  className?: string;
}

export const OptOutSelect: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Select
      classNames={{
        base: className,
      }}
      controlName="optOut"
      isControlled
      label="Opt-Out"
      items={items}
      isDisabled={!items.length}
      selectionMode="single"
      placeholder="Unspecified"
      description="Show only entries matching the opt-out setting"
      {...props}
    />
  );
};
