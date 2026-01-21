import React from 'react';
import { PropertyTable } from '~/community/[communityId]/property-list/property-table';
import { useLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql } from '~/graphql/generated';
import { EditMembershipButton } from './edit-membership-button';

const PropertyDisplayFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyDisplay on Property {
    id
    ...PropertyList_Address
    ...PropertyList_Occupant
    ...PropertyList_Membership
  }
`);

interface Props {
  className?: string;
  isLoading?: boolean;
}

export const PropertyDisplay: React.FC<Props> = ({ className, isLoading }) => {
  const { property } = useLayoutContext();
  const { canEdit } = useSelector((state) => state.community);
  const entry = getFragment(PropertyDisplayFragment, property);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2">
      <PropertyTable items={[entry]} showHeader={false} />
      {canEdit && (
        <EditMembershipButton className="aspect-square h-full w-auto" />
      )}
    </div>
  );
};
