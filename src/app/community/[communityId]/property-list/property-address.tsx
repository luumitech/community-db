import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Address on Property {
    address
  }
`);

export type PropertyAddressFragmentType = FragmentType<typeof EntryFragment>;

interface Props {
  className?: string;
  entry: PropertyAddressFragmentType;
}

export const PropertyAddress: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);

  return (
    <div className={clsx(props.className, 'truncate')}>
      {entry.address ?? ''}
    </div>
  );
};
