import { Card, CardBody, CardHeader } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { getFragment, graphql } from '~/graphql/generated';
import { Icon } from '~/view/base/icon';
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
    membershipList {
      year
      isMember
    }
  }
`);

interface Props {
  className?: string;
}

export const OccupantDisplay: React.FC<Props> = ({ className }) => {
  const { canEdit, communityUi } = useAppContext();
  const { yearSelected } = communityUi;
  const { property: fragment, occupantEditor, sendMail } = usePageContext();
  const property = getFragment(OccupantDisplayFragment, fragment);
  const { occupantList } = property;

  const membership = React.useMemo(() => {
    return property.membershipList.find(
      (entry) => entry.year.toString() === yearSelected
    );
  }, [property, yearSelected]);

  return (
    <Card className={className}>
      <CardHeader>Contact</CardHeader>
      <CardBody className="gap-2">
        <div className="flex gap-2 self-end">
          <ModalButton
            isDisabled={!membership?.isMember}
            onPress={() =>
              sendMail.open({
                membershipYear: yearSelected,
                occupantList,
              })
            }
            endContent={<Icon icon="email" />}
            color="primary"
            variant="bordered"
          >
            Send Membership Confirmation
          </ModalButton>
          {canEdit && (
            <ModalButton
              onPress={() => occupantEditor.open({})}
              color="primary"
              variant="bordered"
            >
              Edit Member Details
            </ModalButton>
          )}
        </div>
        <OccupantTable occupantList={occupantList} />
      </CardBody>
    </Card>
  );
};
