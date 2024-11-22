import clsx from 'clsx';
import React from 'react';
import { type CommunityEntry } from '../_type';
import { AdvanceFilter } from './advance-filter';
import { MoreMenu } from './more-menu';
import { SearchBar } from './search-bar';

interface Props {
  className?: string;
  community?: CommunityEntry;
}

export const PropertyFilterBar: React.FC<Props> = ({
  className,
  community,
}) => {
  const totalCount = community?.propertyList.totalCount ?? 0;
  return (
    <div className={className}>
      <div className="flex gap-2">
        <SearchBar community={community} />
        {community && <MoreMenu community={community} />}
      </div>
      <AdvanceFilter />
      <span className="text-tiny text-foreground-400">
        {totalCount} entries found
      </span>
    </div>
  );
};
