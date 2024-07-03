import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { PropertyEntry } from '../_type';
import { OccupantTable } from './occupant-table';

const OccupantDisplayFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupantDisplay on Property {
    occupantList {
      firstName
      lastName
      optOut
      email
      cell
      work
      home
    }
  }
`);

interface Props {
  className?: string;
  fragment: PropertyEntry;
}

export const OccupantDisplay: React.FC<Props> = ({ className, fragment }) => {
  const entry = getFragment(OccupantDisplayFragment, fragment);

  return (
    <OccupantTable className={className} occupantList={entry.occupantList} />
  );
};
