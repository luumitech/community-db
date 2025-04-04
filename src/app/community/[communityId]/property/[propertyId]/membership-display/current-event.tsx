import { Card, CardBody, CardHeader, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { ModalButton } from '../modal-button';
import { usePageContext } from '../page-context';
import { EventNameSelect } from './event-name-select';

interface Props {
  className?: string;
}

export const CurrentEvent: React.FC<Props> = ({ className }) => {
  const { communityUi } = useAppContext();
  const { lastEventSelected } = communityUi;
  const { registerEvent } = usePageContext();

  return (
    <Card className={className}>
      <CardHeader>Current Event</CardHeader>
      <CardBody>
        <div className="flex gap-2 items-start">
          <EventNameSelect />
          <ModalButton
            className="h-10"
            isDisabled={!lastEventSelected}
            color="primary"
            onPress={() => registerEvent.open({})}
          >
            I&apos;m here!
          </ModalButton>
        </div>
      </CardBody>
    </Card>
  );
};
