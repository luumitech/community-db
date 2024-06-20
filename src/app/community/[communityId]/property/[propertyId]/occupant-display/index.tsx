import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { OccupantEditor } from '../occupant-editor';
import { OccupantTable } from './occupant-table';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupantDisplay on Property {
    ...PropertyId_OccupantEditor
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
  entry: FragmentType<typeof EntryFragment>;
}

export const OccupantDisplay: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);

  const bottomContent = React.useMemo(() => {
    return <OccupantEditor entry={entry} />;
  }, [entry]);

  return (
    <OccupantTable
      className={props.className}
      occupantList={entry.occupantList}
      bottomContent={bottomContent}
    />
  );
};
