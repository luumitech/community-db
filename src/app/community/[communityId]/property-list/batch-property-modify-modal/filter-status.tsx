import { Chip, Input } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { useFilterBarContext } from '../property-filter-bar/context';

interface Props {
  className?: string;
}

export const FilterStatus: React.FC<Props> = ({ className }) => {
  const { filterArg } = useFilterBarContext();

  const { searchText, memberYear, memberEvent } = filterArg;

  const filterSpecified = React.useMemo(() => {
    return !!memberYear || !!memberEvent;
  }, [memberYear, memberEvent]);

  const filterList = React.useMemo(() => {
    return (
      <div className="flex gap-2">
        <Icon className="self-center" icon="filter" />
        {!filterSpecified && (
          <span className="text-sm text-default-500">No filter selected</span>
        )}
        {!!memberYear && (
          <Chip variant="bordered" color={'success'}>
            {memberYear}
          </Chip>
        )}
        {!!memberEvent && (
          <Chip variant="bordered" radius="sm" color={'primary'}>
            {memberEvent}
          </Chip>
        )}
      </div>
    );
  }, [filterSpecified, searchText, memberYear, memberEvent]);

  return (
    <div className={clsx(className)}>
      The batch changes will be applied to properties matching following:
      <div className="ml-8 mt-2">
        {!!searchText && (
          <Input
            className="mb-2"
            label="Address or Member Name Matching"
            startContent={<Icon icon="search" />}
            value={searchText}
            readOnly
          />
        )}
        {filterList}
      </div>
    </div>
  );
};
