import React from 'react';
import { SelectProps, createSelect, type SelectItem } from '~/view/base/select';
import type { InputData } from '../use-hook-form';

const items: SelectItem[] = [
  {
    key: true.toString(),
    textValue: 'Has Warning',
  },
  {
    key: false.toString(),
    textValue: 'No Warning',
  },
];

type CustomProps = Omit<SelectProps, 'controlName' | 'items'>;
const Select = createSelect<InputData>();

interface Props extends CustomProps {
  className?: string;
}

export const WarningSelect: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Select
      classNames={{
        base: className,
      }}
      controlName="warning"
      isControlled
      label="Warning"
      items={items}
      isDisabled={!items.length}
      selectionMode="single"
      placeholder="Unspecified"
      description="Show only entries matching the warning setting"
      {...props}
    />
  );
};
