import React from 'react';
import { twMerge } from 'tailwind-merge';
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

  return (
    <>
      <span className="text-xs text-default-400">{`'${year % 100}`}</span>
      {!!membership?.isMember ? (
        <span className="text-xl text-success">
          <Icon icon="checkmark" />
        </span>
      ) : (
        <div />
      )}
    </>
  );
};
