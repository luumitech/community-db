import { Chip } from '@heroui/chip';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { getFragment, graphql } from '~/graphql/generated';
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
  const entry = getFragment(EntryFragment, fragment);
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
