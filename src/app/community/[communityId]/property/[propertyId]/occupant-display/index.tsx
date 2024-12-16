import { Card, CardBody, CardFooter } from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { getFragment, graphql } from '~/graphql/generated';
import { ModalButton } from '../modal-button';
import { usePageContext } from '../page-context';
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
}

export const OccupantDisplay: React.FC<Props> = ({ className }) => {
  const { canEdit } = useAppContext();
  const { property, occupantEditor } = usePageContext();
  const entry = getFragment(OccupantDisplayFragment, property);

  return (
    <Card className={className}>
      <CardBody>
        <OccupantTable occupantList={entry.occupantList} />
      </CardBody>
      {canEdit && (
        <CardFooter>
          <ModalButton onPress={occupantEditor.disclosure.onOpen}>
            Edit Member Details
          </ModalButton>
        </CardFooter>
      )}
    </Card>
  );
};
