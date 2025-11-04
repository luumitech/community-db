import React from 'react';
import { Select, SelectItem, SelectProps } from '~/view/base/select';

interface GpsItem {
  /** Label to appear in selection list */
  label: string;
  /** Value corresponding to the selection item */
  value: boolean;
}

export const gpsItems: GpsItem[] = [
  {
    label: 'With GPS coordinate',
    value: true,
  },
  {
    label: 'Without GPS coordinate',
    value: false,
  },
];

type CustomProps = Omit<SelectProps<GpsItem>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const GpsSelect: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Select
      classNames={{
        base: className,
      }}
      label="GPS coordinate"
      items={gpsItems}
      isDisabled={!gpsItems.length}
      selectionMode="single"
      placeholder="Unspecified"
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
