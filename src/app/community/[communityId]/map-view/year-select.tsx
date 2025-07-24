import { Select, SelectItem, SelectProps, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useLayoutContext } from '~/community/[communityId]/layout-context';

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
  const yearItems = R.reverse(R.range(minYear, maxYear + 1)).map((yr) => {
    return {
      label: `Members in ${yr}`,
      value: yr,
    };
  });
  return [
    {
      label: 'All properties',
      value: 0,
    },
    ...yearItems,
  ];
}

type CustomSelectProps = Omit<SelectProps<YearItem>, 'children'>;

interface Props extends CustomSelectProps {
  className?: string;
}

export const YearSelect: React.FC<Props> = ({ className, ...props }) => {
  const { minYear, maxYear } = useLayoutContext();
  const yearItems = React.useMemo(() => {
    return yearSelectItems(minYear, maxYear);
  }, [minYear, maxYear]);

  return (
    <Select
      className={cn(className, 'max-w-xs')}
      label="Highlight..."
      items={yearItems}
      disallowEmptySelection
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
