import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { getFragment, graphql } from '~/graphql/generated';
import { PropertyEntry } from '../_type';
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
    <OccupantTable
      className={className}
      occupantList={entry.occupantList}
      {...(canEdit && {
        bottomContent: (
          <ModalButton {...occupantEditor.disclosure.getButtonProps()}>
            Edit Member Details
          </ModalButton>
        ),
      })}
    />
  );
};
