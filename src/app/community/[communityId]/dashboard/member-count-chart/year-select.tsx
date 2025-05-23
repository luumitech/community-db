import { Select, SelectItem, SelectProps, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';

interface YearItem {
  label: string;
  value: number;
}

/**
 * Construct list of SelectItems that includes every year (increment by 1).
 *
 * @param minYear - The minimum year to start from
 * @param maxYear - The maximum year to end at
 * @returns SelectItems with years in descending order
 */
function yearSelectItems(minYear: number, maxYear: number): YearItem[] {
  return R.reverse(R.range(minYear, maxYear + 1)).map((yr) => {
    return {
      label: yr.toString(),
      value: yr,
    };
  });
}

type CustomSelectProps = Omit<SelectProps<YearItem>, 'children'>;

interface Props extends CustomSelectProps {
  className?: string;
  minYear: number;
  maxYear: number;
}

export const YearSelect: React.FC<Props> = ({
  className,
  minYear,
  maxYear,
  ...props
}) => {
  const yearItems = React.useMemo(() => {
    return yearSelectItems(minYear, maxYear);
  }, [minYear, maxYear]);

  return (
    <Select
      className={cn(className, 'max-w-[180px]')}
      label="View Detail For Year"
      items={yearItems}
      {...props}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
