import { Chip } from '@nextui-org/chip';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { graphql, useFragment } from '~/graphql/generated';
import { type PropertyEntry } from './_type';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Occupant on Property {
    occupantList {
      firstName
      lastName
    }
  }
`);

interface Props {
  className?: string;
  fragment: PropertyEntry;
}

export const Occupant: React.FC<Props> = ({ className, fragment }) => {
  const entry = useFragment(EntryFragment, fragment);
  const nameList = entry.occupantList
    .map(({ firstName, lastName }) => {
      const name = `${firstName ?? ''} ${lastName ?? ''}`;
      return name.trim();
    })
    .filter((name) => !R.isEmpty(name));

  return (
    <div className={clsx(className, 'flex items-center gap-2')}>
      {nameList.map((name, idx) => (
        <Chip key={idx} size="sm">
          {name}
        </Chip>
      ))}
    </div>
  );
};
