import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PlainSelect,
  type PlainSelectProps,
  type SelectItem,
} from '~/view/base/select';

/**
 * Construct list of SelectItems that includes every year (increment by 1).
 *
 * @param minYear - The minimum year to start from
 * @param maxYear - The maximum year to end at
 * @returns SelectItems with years in descending order
 */
function yearSelectItems(minYear: number, maxYear: number): SelectItem[] {
  const yearItems = R.reverse(R.range(minYear, maxYear + 1)).map((yr) => {
    return {
      textValue: `Members in ${yr}`,
      key: yr,
    };
  });
  return [
    {
      textValue: 'All properties',
      key: 0,
    },
    ...yearItems,
  ];
}

type CustomSelectProps = Omit<PlainSelectProps, 'items'>;

interface Props extends CustomSelectProps {
  className?: string;
}

export const YearSelect: React.FC<Props> = ({ className, ...props }) => {
  const { minYear, maxYear } = useLayoutContext();
  const yearItems = React.useMemo(() => {
    return yearSelectItems(minYear, maxYear);
  }, [minYear, maxYear]);

  return (
    <PlainSelect
      className={cn(className, 'max-w-xs')}
      label="Highlight..."
      items={yearItems}
      disallowEmptySelection
      {...props}
    />
  );
};
