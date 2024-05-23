import React from 'react';
import { IoCheckmark } from 'react-icons/io5';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Membership on Property {
    membershipList {
      year
      isMember
    }
  }
`);

export type MemberShipFragmentType = FragmentType<typeof EntryFragment>;

interface Props {
  className?: string;
  entry: MemberShipFragmentType;
  year: number;
}

export const Membership: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);
  const membership = entry.membershipList.find(
    ({ year }) => year === props.year
  );

  return (
    <div className={props.className}>
      {!!membership?.isMember && <IoCheckmark className="text-xl" />}
    </div>
  );
};
