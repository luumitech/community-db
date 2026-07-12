import { cn } from '@heroui/react';
import React from 'react';
import {
  FilterChip,
  FilterDrawer,
  type FilterDrawerArg,
  type FilterInputData,
} from '~/community/[communityId]/common/filter-component';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { type FilterT } from '~/lib/reducers/search-bar';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';

const useDrawerControl = useDisclosureWithArg<FilterDrawerArg>;

interface Props {
  className?: string;
  filters: FilterT;
  onFilterChange?: (input: FilterInputData) => Promise<void>;
  isDisabled?: boolean;
  description?: React.ReactNode;
}

export const FilterSelect: React.FC<Props> = ({
  className,
  filters,
  onFilterChange,
  isDisabled,
  description,
}) => {
  const { arg, disclosure, open } = useDrawerControl();

  const openDrawer = React.useCallback(() => open({}), [open]);

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="faded"
          isDisabled={isDisabled}
          startContent={<Icon icon="filter" />}
          onPress={() => open({})}
        >
          Optional Filter...
        </Button>
        <FilterChip
          className="flex-wrap overflow-auto"
          isDisabled={isDisabled}
          filters={filters}
          onFilterChange={onFilterChange}
          openDrawer={openDrawer}
        />
      </div>
      {description}
      {arg != null && (
        <FilterDrawer
          {...arg}
          disclosure={disclosure}
          filtersToShow={[
            'memberYearList',
            'nonMemberYearList',
            'memberEventList',
            'ticketList',
          ]}
          defaultState={filters}
          onFilterChange={onFilterChange}
        />
      )}
    </div>
  );
};
