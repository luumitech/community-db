import React from 'react';
import { graphql, useFragment } from '~/graphql/generated';
import { PropertyEntry } from '../_type';
import { OccupantEditor } from '../occupant-editor';
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
  const entry = useFragment(OccupantDisplayFragment, fragment);

  const bottomContent = React.useMemo(() => {
    return <OccupantEditor fragment={fragment} />;
  }, [fragment]);

  return (
    <OccupantTable
      className={className}
      occupantList={entry.occupantList}
      bottomContent={bottomContent}
    />
  );
};
