import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const PropertyFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Address on Property {
    id
    address
  }
`);

interface Props {
  entry: FragmentType<typeof PropertyFragment>;
}

export const PropertyAddress: React.FC<Props> = (props) => {
  const entry = useFragment(PropertyFragment, props.entry);

  return <div className="truncate">{entry.address ?? ''}</div>;
};
