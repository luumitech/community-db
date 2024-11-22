import { Input } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Icon } from '~/view/base/icon';
import { type CommunityEntry } from '../../_type';

interface Props {
  className?: string;
  community?: CommunityEntry;
}

export const SearchBar: React.FC<Props> = ({ className, community }) => {
  const { communityUi } = useAppContext();

  const setSearchText = (input?: string) => {
    communityUi.actions.setPropertyListSearch(input);
  };
  return (
    <Input
      className={className}
      isClearable
      placeholder="Search Address or Member Name"
      startContent={<Icon icon="search" />}
      defaultValue={communityUi.propertyListSearch}
      onValueChange={setSearchText}
      onClear={() => setSearchText(undefined)}
    />
  );
};
