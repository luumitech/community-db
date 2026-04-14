import React from 'react';
import { SelectItem, SelectProps, createSelect } from '~/view/base/select';
import type { InputData } from '../use-hook-form';

interface WarningItem {
  /** Label to appear in selection list */
  label: string;
  /** Value corresponding to the selection item */
  value: boolean;
}

export const items: WarningItem[] = [
  {
    label: 'Has Warning',
    value: true,
  },
  {
    label: 'No Warning',
    value: false,
  },
];

type CustomProps = Omit<SelectProps<WarningItem>, 'controlName' | 'children'>;
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
    >
      {(item) => {
        return (
          <SelectItem key={item.value.toString()} textValue={item.label}>
            <div>{item.label}</div>
          </SelectItem>
        );
      }}
    </Select>
  );
};
