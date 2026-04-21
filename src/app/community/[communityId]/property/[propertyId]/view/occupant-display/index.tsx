import { Button, Card, CardBody, Link } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { OccupantTable } from './occupant-table';

export const OccupantDisplayFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupantDisplay on Property {
    id
    occupantList {
      firstName
      lastName
      optOut
      infoList {
        type
        label
        value
      }
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
  const { property: fragment, community } = useLayoutContext();
  const property = getFragment(OccupantDisplayFragment, fragment);

  const occupantList = React.useMemo(() => {
    return property.occupantList.map((entry, idx) => ({
      // GridTable requires each table row to have unique ID
      id: `${property.id}-${idx}`,
      ...entry,
    }));
  }, [property]);

  const canSendEmail = React.useMemo(() => {
    const hasEmail = occupantList.some(({ infoList }) =>
      infoList?.some(({ type }) => type === GQL.ContactInfoType.Email)
    );
    const membership = property.membershipList.find(
      (entry) => entry.year === yearSelected
    );
    return hasEmail && membership?.isMember;
  }, [occupantList, property.membershipList, yearSelected]);

  const communityId = community.id;
  const propertyId = property.id;
  const topContent = React.useMemo(() => {
    return (
      <div className="mb-2 flex flex-wrap justify-end gap-2">
        <Button
          as={Link}
          isDisabled={!canSendEmail}
          size="sm"
          endContent={<Icon icon="email" />}
          color="primary"
          variant="bordered"
          href={appPath('composeMembershipMail', {
            path: { communityId, propertyId },
            query: {
              membershipYear: yearSelected?.toString() ?? '',
            },
          })}
        >
          {appLabel('composeMembershipMail')}
        </Button>
        {canEdit && (
          <Button
            as={Link}
            color="primary"
            variant="bordered"
            size="sm"
            endContent={<Icon icon="edit" />}
            href={appPath('occupancyEditor', {
              path: { communityId, propertyId },
            })}
          >
            {appLabel('occupancyEditor')}
          </Button>
        )}
      </div>
    );
  }, [canEdit, canSendEmail, communityId, propertyId, yearSelected]);

  return (
    <Card className={className}>
      <CardBody
        /**
         * This is to prevent the text in OccupantTable in scrolling to the top
         * padding of the cardbody
         */
        className="p-3"
      >
        <OccupantTable items={occupantList} topContent={topContent} />
      </CardBody>
    </Card>
  );
};
