import clsx from 'clsx';
import React from 'react';
import { PropertySearchBar } from '~/community/[communityId]/common/property-search-bar';
import { type CommunityEntry } from '../_type';
import { MoreMenu } from '../more-menu';

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
    <>
      {community && <MoreMenu community={community} />}
      <div className={clsx(className, 'flex flex-col gap-2')}>
        <PropertySearchBar />
        <span className="text-tiny text-foreground-400">
          {totalCount} entries found
        </span>
      </div>
    </>
  );
};
