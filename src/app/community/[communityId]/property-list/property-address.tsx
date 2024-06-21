import clsx from 'clsx';
import React from 'react';
import { graphql, useFragment } from '~/graphql/generated';
import { type PropertyEntry } from './_type';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Address on Property {
    address
  }
`);

interface Props {
  className?: string;
  fragment: PropertyEntry;
}

export const PropertyAddress: React.FC<Props> = ({ className, fragment }) => {
  const entry = useFragment(EntryFragment, fragment);

  return (
    <div className={clsx(className, 'truncate')}>{entry.address ?? ''}</div>
  );
};
