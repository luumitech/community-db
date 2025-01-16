import clsx from 'clsx';
import React from 'react';
import { PropertySearchBar } from '~/community/[communityId]/common/property-search-bar';
import { type CommunityEntry } from '../_type';

interface Props {
  className?: string;
  community?: CommunityEntry;
}

export const PropertySearchHeader: React.FC<Props> = ({
  className,
  community,
}) => {
  const totalCount = community?.propertyList.totalCount ?? 0;
  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      <PropertySearchBar autoFocus />
      <span className="text-tiny text-foreground-400">
        {totalCount} entries found
      </span>
    </div>
  );
};
