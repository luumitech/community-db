import React from 'react';
import simplur from 'simplur';
import { twMerge } from 'tailwind-merge';
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
    <div className={twMerge('flex flex-col gap-2', className)}>
      <PropertySearchBar
        autoFocus
        description={
          <span className="text-xs text-foreground/50">
            {simplur`${totalCount} entr[y|ies] found`}
          </span>
        }
      />
    </div>
  );
};
