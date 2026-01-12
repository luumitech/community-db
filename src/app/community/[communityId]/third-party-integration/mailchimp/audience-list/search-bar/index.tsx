import { cn, Input, InputProps, ScrollShadow } from '@heroui/react';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { FilterButton } from './filter-button';
import { FilterChip } from './filter-chip';
import { FilterDrawer, type DrawerArg } from './filter-drawer';
import { InputData } from './use-hook-form';

const useDrawerControl = useDisclosureWithArg<DrawerArg>;

interface Props extends InputProps {
  onChange?: () => void;
}

export const SearchBar: React.FC<Props> = ({ onChange, ...inputProps }) => {
  const { arg, disclosure, open } = useDrawerControl();
  const dispatch = useDispatch();
  const mailchimp = useSelector((state) => state.mailchimp);

  const setSearchText = (input?: string) => {
    dispatch(actions.mailchimp.setSearchText(input));
    onChange?.();
  };

  const onFilterChange = React.useCallback(
    async (input: InputData) => {
      dispatch(actions.mailchimp.setFilter(input));
      onChange?.();
    },
    [dispatch, onChange]
  );

  const openDrawer = React.useCallback(() => open({}), [open]);

  return (
    <>
      <Input
        placeholder="Search Email or Member Name"
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
              disabled={!mailchimp.searchText}
              onClick={() => setSearchText(undefined)}
            />
            <FilterButton openDrawer={openDrawer} />
            <ScrollShadow orientation="horizontal" hideScrollBar>
              <FilterChip
                openDrawer={openDrawer}
                filters={mailchimp.filter}
                onFilterChange={onFilterChange}
              />
            </ScrollShadow>
          </div>
        }
        value={mailchimp.searchText ?? ''}
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
