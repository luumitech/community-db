import { cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';

const AddressFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Address on Property {
    address
  }
`);
type AddressFragmentType = FragmentType<typeof AddressFragment>;

interface Props {
  className?: string;
  fragment: AddressFragmentType;
}

export const PropertyAddress: React.FC<Props> = ({ className, fragment }) => {
  const entry = getFragment(AddressFragment, fragment);

  return <div className={cn(className, 'truncate')}>{entry.address ?? ''}</div>;
};
