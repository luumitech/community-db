import React from 'react';
import { PropertyCard } from '~/community/[communityId]/property-list/property-card';
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

  const EditMembership = React.useCallback(() => {
    if (!canEdit) {
      return null;
    }

    return (
      <>
        {/* header placeholder */}
        <div />
        <EditMembershipButton />
      </>
    );
  }, [canEdit]);

  return (
    <PropertyCard.Container className={className}>
      <PropertyCard.Entry property={entry} showHeader>
        <EditMembership />
      </PropertyCard.Entry>
    </PropertyCard.Container>
  );
};
