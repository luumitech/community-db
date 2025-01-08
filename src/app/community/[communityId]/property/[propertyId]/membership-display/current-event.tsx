import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
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
          <EventNameSelect className="max-w-xs" />
          <ModalButton
            className="h-10"
            isDisabled={!lastEventSelected}
            color="primary"
            onPress={registerEvent.disclosure.onOpen}
          >
            I'm here!
          </ModalButton>
        </div>
      </CardBody>
    </Card>
  );
};
