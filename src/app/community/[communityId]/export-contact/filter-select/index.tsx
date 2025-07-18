import { Button, cn } from '@heroui/react';
import React from 'react';
import { FilterChip } from '~/community/[communityId]/common/filter-component';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { Icon } from '~/view/base/icon';
import { FilterDrawer, type DrawerArg } from './filter-drawer';
import { type InputData } from './use-hook-form';

const useDrawerControl = useDisclosureWithArg<DrawerArg>;

interface Props {
  className?: string;
  filters: InputData;
  onFilterChange?: (input: InputData) => Promise<void>;
  isDisabled?: boolean;
}

export const FilterSelect: React.FC<Props> = ({
  className,
  filters,
  onFilterChange,
  isDisabled,
}) => {
  const { arg, disclosure, open } = useDrawerControl();

  const openDrawer = React.useCallback(() => {
    open(filters);
  }, [open, filters]);

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          size="sm"
          variant="faded"
          isDisabled={isDisabled}
          startContent={<Icon icon="filter" />}
          onPress={() => openDrawer()}
        >
          Optional Filter...
        </Button>
        <FilterChip
          isDisabled={isDisabled}
          filters={filters}
          onFilterChange={onFilterChange}
          openDrawer={openDrawer}
        />
      </div>
      {arg != null && (
        <FilterDrawer
          {...arg}
          disclosure={disclosure}
          onFilterChange={onFilterChange}
        />
      )}
    </div>
  );
};
