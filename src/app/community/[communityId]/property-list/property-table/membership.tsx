import React from 'react';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import { Icon } from '~/view/base/icon';

const MembershipFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Membership on Property {
    membershipList {
      year
      isMember
    }
  }
`);
type MembershipFragmentType = FragmentType<typeof MembershipFragment>;

interface Props {
  fragment: MembershipFragmentType;
  year: number;
}

export const Membership: React.FC<Props> = ({ fragment, year }) => {
  const property = getFragment(MembershipFragment, fragment);
  const membership = property.membershipList.find(
    (entry) => entry.year === year
  );

  if (!membership?.isMember) {
    return <div />;
  }

  return (
    <span
      className="m-auto text-xl text-success"
      // Used for playwright to identify if property row has membership in a given year
      data-testid={`member-${year}`}
    >
      <Icon icon="checkmark" />
    </span>
  );
};
