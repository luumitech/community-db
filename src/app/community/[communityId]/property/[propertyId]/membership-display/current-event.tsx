import { Button, Card, CardBody, CardHeader, cn } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { Icon } from '~/view/base/icon';
import { useLayoutContext } from '../layout-context';
import { EventNameSelect } from './event-name-select';

interface Props {
  className?: string;
}

export const CurrentEvent: React.FC<Props> = ({ className }) => {
  const { lastEventSelected } = useSelector((state) => state.ui);
  const { registerEvent } = useLayoutContext();

  return (
    <Card className={className}>
      <CardHeader>Current Event</CardHeader>
      <CardBody>
        <div className="flex gap-2 items-start">
          <EventNameSelect />
          <Button
            className="h-10"
            isDisabled={!lastEventSelected}
            color="primary"
            size="sm"
            endContent={<Icon icon="edit" />}
            onPress={() => registerEvent.open({})}
          >
            I&apos;m here!
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
