import { Chip, type ChipProps } from '@heroui/chip';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';

const OccupantFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Occupant on Property {
    occupantList {
      firstName
      lastName
    }
  }
`);
type OccupantFragmentType = FragmentType<typeof OccupantFragment>;

interface Props extends ChipProps {
  className?: string;
  fragment: OccupantFragmentType;
}

export const Occupant: React.FC<Props> = ({
  className,
  fragment,
  ...props
}) => {
  const entry = getFragment(OccupantFragment, fragment);
  const nameList = entry.occupantList
    .map(({ firstName, lastName }) => {
      const name = `${firstName ?? ''} ${lastName ?? ''}`;
      return name.trim();
    })
    .filter((name) => !R.isEmpty(name));

  return (
    <div className={twMerge('flex flex-wrap items-center gap-2', className)}>
      {nameList.map((name, idx) => (
        <Chip key={idx} size="sm" {...props}>
          {name}
        </Chip>
      ))}
    </div>
  );
};
