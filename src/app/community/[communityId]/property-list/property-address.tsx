import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
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
  const entry = getFragment(EntryFragment, fragment);

  return (
    <div className={clsx(className, 'truncate')}>{entry.address ?? ''}</div>
  );
};
