import { Input, InputProps } from '@heroui/react';
import React from 'react';
import { FilterChip } from '~/community/[communityId]/common/filter-component';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { FilterButton } from './filter-button';
import { FilterDrawer, type DrawerArg } from './filter-drawer';
import { type InputData } from './use-hook-form';

const useDrawerControl = useDisclosureWithArg<DrawerArg>;

export interface SearchBarProps extends InputProps {
  onChange?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onChange,
  ...inputProps
}) => {
  const { arg, disclosure, open } = useDrawerControl();
  const dispatch = useDispatch();
  const { searchText, memberYearList, nonMemberYear, memberEvent, withGps } =
    useSelector((state) => state.searchBar);

  const setSearchText = (input?: string) => {
    dispatch(actions.searchBar.setSearchText(input));
    onChange?.();
  };

  const onFilterChange = React.useCallback(
    async (input: InputData) => {
      dispatch(actions.searchBar.setMemberYearList(input.memberYearList));
      dispatch(actions.searchBar.setNonMemberYear(input.nonMemberYear));
      dispatch(actions.searchBar.setMemberEvent(input.memberEvent));
      dispatch(actions.searchBar.setWithGps(input.withGps));
      onChange?.();
    },
    [dispatch, onChange]
  );

  const openDrawer = React.useCallback(() => {
    open({ memberYearList, nonMemberYear, memberEvent, withGps });
  }, [open, memberYearList, nonMemberYear, memberEvent, withGps]);

  return (
    <>
      <Input
        placeholder="Search Address or Member Name"
        startContent={<Icon icon="search" />}
        // isClearable
        // onClear={() => setSearchText(undefined)}
        endContent={
          <div className="flex cursor-pointer items-center justify-center gap-2">
            {/**
             * `isClearable`/`onClear` cannot be used together with endContent See:
             * https://github.com/nextui-org/nextui/issues/2254
             */}
            <FlatButton
              icon="cross"
              disabled={!searchText}
              onClick={() => setSearchText(undefined)}
            />
            <FilterButton openDrawer={openDrawer} />
            <FilterChip
              openDrawer={openDrawer}
              filters={{ memberYearList, nonMemberYear, memberEvent, withGps }}
              onFilterChange={onFilterChange}
            />
          </div>
        }
        // endContent={
        //   <div className="pointer-events-none flex items-center">
        //     <span className="text-default-400 text-small">.org/</span>
        //   </div>
        // }
        value={searchText ?? ''}
        onValueChange={setSearchText}
        {...inputProps}
      />
      {arg != null && (
        <FilterDrawer
          {...arg}
          disclosure={disclosure}
          onFilterChange={onFilterChange}
        />
      )}
    </>
  );
};
