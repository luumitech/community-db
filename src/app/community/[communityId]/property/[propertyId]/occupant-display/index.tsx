import { Button, Card, CardBody, CardHeader, Link } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { useLayoutContext } from '../layout-context';
import { OccupantTable } from './occupant-table';

const OccupantDisplayFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupantDisplay on Property {
    id
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
  const { canEdit } = useSelector((state) => state.community);
  const { yearSelected } = useSelector((state) => state.ui);
  const { property: fragment, community, sendMail } = useLayoutContext();
  const property = getFragment(OccupantDisplayFragment, fragment);
  const { occupantList } = property;

  const canSendEmail = React.useMemo(() => {
    const hasEmail = occupantList.some(({ email }) => !!email?.trim());
    const membership = property.membershipList.find(
      (entry) => entry.year === yearSelected
    );
    return hasEmail && membership?.isMember;
  }, [occupantList, property.membershipList, yearSelected]);

  return (
    <Card className={className}>
      <CardHeader>Contact</CardHeader>
      <CardBody className="gap-2">
        <div className="flex flex-wrap gap-2 self-end">
          <Button
            isDisabled={!canSendEmail}
            onPress={() =>
              sendMail.open({
                community,
                membershipYear: yearSelected?.toString() ?? '',
                occupantList,
              })
            }
            size="sm"
            endContent={<Icon icon="email" />}
            color="primary"
            variant="bordered"
          >
            Send Membership Confirmation
          </Button>
          {canEdit && (
            <Button
              as={Link}
              color="primary"
              variant="bordered"
              size="sm"
              endContent={<Icon icon="edit" />}
              href={appPath('occupantEditor', {
                path: { communityId: community.id, propertyId: property.id },
              })}
            >
              Edit Member Details
            </Button>
          )}
        </div>
        <OccupantTable occupantList={occupantList} />
      </CardBody>
    </Card>
  );
};
