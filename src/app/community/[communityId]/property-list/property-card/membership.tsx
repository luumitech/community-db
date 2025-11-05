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

const className = {
  // Must match width of membership year header labe: (i.e. '2025')
  cell: 'w-[30px]',
};

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
    return <div className={className.cell} />;
  }

  return (
    <span className="m-auto text-xl text-success">
      <Icon className={className.cell} icon="checkmark" />
    </span>
  );
};
