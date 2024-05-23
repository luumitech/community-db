import { Card, CardBody, CardHeader, Textarea } from '@nextui-org/react';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyId_MembershipDisplay on Property {
    notes
  }
`);

interface Props {
  className?: string;
  entry: FragmentType<typeof EntryFragment>;
}

export const MembershipDisplay: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);
  return (
    <div className={props.className}>
      <Card>
        <CardHeader>Notes</CardHeader>
        <CardBody>
          <span className="whitespace-pre-wrap">{entry.notes}</span>
        </CardBody>
      </Card>
    </div>
  );
};
