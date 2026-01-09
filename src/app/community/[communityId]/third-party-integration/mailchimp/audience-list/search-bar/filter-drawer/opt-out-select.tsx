import React from 'react';
import { Select, SelectItem, SelectProps } from '~/view/base/select';

interface OptOutItem {
  /** Label to appear in selection list */
  label: string;
  /** Value corresponding to the selection item */
  value: boolean;
}

export const items: OptOutItem[] = [
  {
    label: 'Opt-Out',
    value: true,
  },
  {
    label: 'Not Opt-Out',
    value: false,
  },
];

type CustomProps = Omit<SelectProps<OptOutItem>, 'controlName' | 'children'>;

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
      label="Opt-Out"
      items={items}
      isDisabled={!items.length}
      selectionMode="single"
      placeholder="Unspecified"
      description="Show only entries matching the opt-out setting"
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
