import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const PropertyFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Address on Property {
    address
  }
`);

export type PropertyAddressFragmentType = FragmentType<typeof PropertyFragment>;

interface Props {
  className?: string;
  entry: PropertyAddressFragmentType;
}

export const PropertyAddress: React.FC<Props> = (props) => {
  const entry = useFragment(PropertyFragment, props.entry);

  return (
    <div className={clsx(props.className, 'truncate')}>
      {entry.address ?? ''}
    </div>
  );
};
