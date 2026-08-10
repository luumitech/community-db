import { cn } from '@heroui/react';
import React from 'react';
import {
  FilterChip,
  FilterDrawer,
  type FilterDrawerArg,
  type FilterInputData,
} from '~/community/[communityId]/common/filter-component';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { PlainInput, type PlainInputProps } from '~/view/base/input';
import { FilterButton } from './filter-button';

const useDrawerControl = useDisclosureWithArg<FilterDrawerArg>;

type CustomInputProps = PlainInputProps;
interface Props extends CustomInputProps {
  onChange?: () => void;
}

export const PropertySearchBar: React.FC<Props> = ({
  onChange,
  ...inputProps
}) => {
  const { arg, disclosure, open } = useDrawerControl();
  const dispatch = useDispatch();
  const searchBar = useSelector((state) => state.searchBar);

  const setSearchText = (input?: string) => {
    dispatch(actions.searchBar.setSearchText(input));
    onChange?.();
  };

  const onFilterChange = React.useCallback(
    async (input: FilterInputData) => {
      dispatch(actions.searchBar.setFilter(input));
      onChange?.();
    },
    [dispatch, onChange]
  );

  const openDrawer = React.useCallback(() => open({}), [open]);

  return (
    <>
      <PlainInput
        placeholder="Search Address, Member Name or Email"
        startContent={<Icon className="shrink-0" icon="search" />}
        // isClearable
        // onClear={() => setSearchText(undefined)}
        endContent={
          <div
            className={cn(
              'flex items-center justify-center gap-2',
              'max-w-3/12 sm:max-w-1/2',
              'cursor-pointer'
            )}
          >
            {/**
             * `isClearable`/`onClear` cannot be used together with endContent See:
             * https://github.com/nextui-org/nextui/issues/2254
             */}
            <FlatButton
              icon="cross"
              disabled={!searchBar.searchText}
              onClick={() => setSearchText(undefined)}
            />
            <FilterButton openDrawer={openDrawer} />
            <FilterChip
              openDrawer={openDrawer}
              filters={searchBar.filter}
              onFilterChange={onFilterChange}
            />
          </div>
        }
        // endContent={
        //   <div className="pointer-events-none flex items-center">
        //     <span className="text-foreground/60 text-sm">.org/</span>
        //   </div>
        // }
        value={searchBar.searchText ?? ''}
        onValueChange={setSearchText}
        {...inputProps}
      />
      {arg != null && (
        <FilterDrawer
          {...arg}
          disclosure={disclosure}
          filtersToShow={[
            'memberYearList',
            'nonMemberYearList',
            'memberEventList',
            'ticketList',
            'withGps',
          ]}
          defaultState={searchBar.filter}
          onFilterChange={onFilterChange}
        />
      )}
    </>
  );
};
