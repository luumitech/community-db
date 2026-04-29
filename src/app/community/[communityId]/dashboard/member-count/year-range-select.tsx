import { cn } from '@heroui/react';
import React from 'react';
import {
  PlainSelect,
  type PlainSelectProps,
  type SelectItem,
} from '~/view/base/select';

const yearRangeSelectionList: SelectItem[] = [
  { textValue: '5', key: 5 },
  { textValue: '10', key: 10 },
  { textValue: '15', key: 15 },
  { textValue: 'Max', key: -1 },
];

interface Props extends Omit<PlainSelectProps, 'items'> {
  className?: string;
}

export const YearRangeSelect: React.FC<Props> = ({ className, ...props }) => {
  return (
    <PlainSelect
      className={cn(className, 'min-w-[130px]')}
      label="Years To Show"
      items={yearRangeSelectionList}
      disallowEmptySelection
      {...props}
    />
  );
};
