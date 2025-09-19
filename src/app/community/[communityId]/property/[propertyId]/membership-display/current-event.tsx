import { Button, Card, CardBody, CardHeader, Link, cn } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { useLayoutContext } from '../layout-context';
import { EventNameSelect } from './event-name-select';

interface Props {
  className?: string;
}

export const CurrentEvent: React.FC<Props> = ({ className }) => {
  const { community, property } = useLayoutContext();
  const { lastEventSelected } = useSelector((state) => state.ui);

  return (
    <Card className={className}>
      <CardHeader>Current Event</CardHeader>
      <CardBody>
        <div className="flex gap-2 items-start">
          <EventNameSelect />
          <Button
            as={Link}
            className="h-10"
            isDisabled={!lastEventSelected}
            color="primary"
            size="sm"
            endContent={<Icon icon="edit" />}
            href={appPath('registerEvent', {
              path: { communityId: community.id, propertyId: property.id },
              query: { eventName: lastEventSelected! },
            })}
          >
            I&apos;m here!
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
