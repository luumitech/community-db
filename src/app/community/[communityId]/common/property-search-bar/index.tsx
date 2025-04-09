import { Input, InputProps } from '@heroui/react';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { FilterButton } from './filter-button';
import { FilterChip } from './filter-chip';
import { FilterDrawer, type DrawerArg } from './filter-drawer';
import { type InputData } from './use-hook-form';

const useDrawerControl = useDisclosureWithArg<DrawerArg>;

interface Props extends InputProps {
  onChange?: () => void;
}

export const PropertySearchBar: React.FC<Props> = ({
  onChange,
  ...inputProps
}) => {
  const { arg, disclosure, open } = useDrawerControl();
  const dispatch = useDispatch();
  const { searchText, memberYear, nonMemberYear, event } = useSelector(
    (state) => state.searchBar
  );

  const setSearchText = (input?: string) => {
    dispatch(actions.searchBar.setSearchText(input));
    onChange?.();
  };

  const onFilterChange = React.useCallback(
    async (input: InputData) => {
      dispatch(actions.searchBar.setMemberYear(input.memberYear));
      dispatch(actions.searchBar.setNonMemberYear(input.nonMemberYear));
      dispatch(actions.searchBar.setEvent(input.event));
      onChange?.();
    },
    [dispatch, onChange]
  );

  const openDrawer = React.useCallback(() => {
    open({ memberYear, nonMemberYear, event });
  }, [open, memberYear, nonMemberYear, event]);

  return (
    <>
      <Input
        placeholder="Search Address or Member Name"
        startContent={<Icon icon="search" />}
        // isClearable
        // onClear={() => setSearchText(undefined)}
        endContent={
          <div className="flex items-center justify-center gap-2">
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
