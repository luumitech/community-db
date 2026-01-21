import { Chip, ScrollShadow, type ChipProps } from '@heroui/react';
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

  if (nameList.length === 0) {
    return null;
  }

  return (
    <ScrollShadow orientation="horizontal" hideScrollBar>
      <div
        className={twMerge('flex flex-nowrap items-center gap-2', className)}
        role="list"
      >
        {nameList.map((name, idx) => (
          <Chip key={idx} size="sm" role="listitem" {...props}>
            {name}
          </Chip>
        ))}
      </div>
    </ScrollShadow>
  );
};
