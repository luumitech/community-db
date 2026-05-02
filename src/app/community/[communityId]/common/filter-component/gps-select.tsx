import React from 'react';
import { Select, SelectProps, type SelectItem } from '~/view/base/select';

export const gpsItems: SelectItem[] = [
  {
    key: true.toString(),
    textValue: 'With GPS coordinate',
  },
  {
    key: false.toString(),
    textValue: 'Without GPS coordinate',
  },
];

type CustomProps = Omit<SelectProps, 'children'>;

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
    />
  );
};
