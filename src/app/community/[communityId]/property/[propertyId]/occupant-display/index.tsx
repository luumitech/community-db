import { Card, CardBody, CardHeader } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useSelector } from '~/custom-hooks/redux';
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
  const { canEdit } = useLayoutContext();
  const { yearSelected } = useSelector((state) => state.ui);
  const {
    property: fragment,
    community,
    occupantEditor,
    sendMail,
  } = usePageContext();
  const property = getFragment(OccupantDisplayFragment, fragment);
  const { occupantList } = property;

  const canSendEmail = React.useMemo(() => {
    const hasEmail = occupantList.some(({ email }) => !!email?.trim());
    const membership = property.membershipList.find(
      (entry) => entry.year.toString() === yearSelected
    );
    return hasEmail && membership?.isMember;
  }, [occupantList, property.membershipList, yearSelected]);

  return (
    <Card className={className}>
      <CardHeader>Contact</CardHeader>
      <CardBody className="gap-2">
        <div className="flex flex-wrap gap-2 self-end">
          <ModalButton
            isDisabled={!canSendEmail}
            onPress={() =>
              sendMail.open({
                community,
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
