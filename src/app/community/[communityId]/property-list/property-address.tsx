import { Skeleton } from '@nextui-org/react';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const PropertyFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Address on Property {
    id
    address
  }
`);

interface Props {
  entry?: FragmentType<typeof PropertyFragment>;
  loading: boolean;
}

export const PropertyAddress: React.FC<Props> = (props) => {
  const { loading } = props;
  const entry = useFragment(PropertyFragment, props.entry);

  return (
    <Skeleton isLoaded={!loading} className="rounded-lg">
      <div className="h-5">{entry?.address ?? ''}</div>
    </Skeleton>
  );
};
