import { Chip } from '@nextui-org/chip';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const PropertyFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Occupant on Property {
    occupantList {
      firstName
      lastName
    }
  }
`);

export type OccupantFragmentType = FragmentType<typeof PropertyFragment>;

interface Props {
  className?: string;
  entry: FragmentType<typeof PropertyFragment>;
}

export const Occupant: React.FC<Props> = (props) => {
  const entry = useFragment(PropertyFragment, props.entry);
  const nameList = entry.occupantList
    .map(({ firstName, lastName }) => {
      const name = `${firstName ?? ''} ${lastName ?? ''}`;
      return name.trim();
    })
    .filter((name) => !R.isEmpty(name));

  return (
    <div className={clsx(props.className, 'flex gap-2')}>
      {nameList.map((name, idx) => (
        <Chip key={idx} size="sm">
          {name}
        </Chip>
      ))}
    </div>
  );
};
