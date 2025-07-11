import { cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem } from '~/view/base/select';

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

interface Props {
  className?: string;
}

export const GpsSelect: React.FC<Props> = ({ className }) => {
  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      controlName="filter.withGps"
      label="GPS coordinate"
      items={gpsItems}
      isDisabled={!gpsItems.length}
      selectionMode="single"
      placeholder="Unspecified"
      // disallowEmptySelection
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
