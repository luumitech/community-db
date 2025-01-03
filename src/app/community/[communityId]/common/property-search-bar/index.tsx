import { Input } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { FilterButton } from './filter-button';
import { FilterChip } from './filter-chip';
import { FilterDrawer } from './filter-drawer';

interface Props {
  className?: string;
}

export const PropertySearchBar: React.FC<Props> = ({ className }) => {
  const { communityUi } = useAppContext();

  const setSearchText = (input?: string) => {
    communityUi.actions.setPropertyListSearch(input);
  };

  return (
    <>
      <Input
        className={className}
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
              disabled={!communityUi.propertyListSearch}
              onClick={() => setSearchText(undefined)}
            />
            <FilterButton />
            <FilterChip />
          </div>
        }
        // endContent={
        //   <div className="pointer-events-none flex items-center">
        //     <span className="text-default-400 text-small">.org/</span>
        //   </div>
        // }
        value={communityUi.propertyListSearch ?? ''}
        onValueChange={setSearchText}
      />
      <FilterDrawer />
    </>
  );
};
