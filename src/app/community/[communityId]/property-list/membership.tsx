import React from 'react';
import { IoCheckmark } from 'react-icons/io5';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const PropertyFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Membership on Property {
    id
    membershipList {
      year
      isMember
    }
  }
`);

interface Props {
  entry: FragmentType<typeof PropertyFragment>;
  year: number;
}

export const Membership: React.FC<Props> = (props) => {
  const entry = useFragment(PropertyFragment, props.entry);
  const membership = entry.membershipList.find(
    ({ year }) => year === props.year
  );

  return (
    <div>{!!membership?.isMember && <IoCheckmark className="text-xl" />}</div>
  );
};
