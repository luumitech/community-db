import { Button, cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { type ModalControl } from '../send-mail-modal';

interface Props {
  className?: string;
  membershipYear: string;
  registerEvent?: GQL.RegisterEventMutation['registerEvent'];
  sendMail: ModalControl;
}

export const SuccessDialog: React.FC<Props> = ({
  className,
  membershipYear,
  registerEvent,
  sendMail,
}) => {
  if (!registerEvent) {
    return null;
  }

  // Show email confirmation only when registering for the first event
  const { occupantList } = registerEvent.property;
  const canSendEmail = occupantList.some(({ email }) => !!email?.trim());
  if (!canSendEmail) {
    return (
      <div className={cn(className)}>
        Membership registered, but we do not have their email addresses to send
        membership confirmation.
      </div>
    );
  }

  return (
    <div className={cn(className, 'flex flex-wrap items-center gap-2')}>
      Membership registered
      <Button
        color="primary"
        variant="faded"
        size="sm"
        endContent={<Icon icon="email" />}
        onPress={() =>
          sendMail.open({
            community: registerEvent.community,
            membershipYear,
            occupantList,
          })
        }
      >
        Send Membership Confirmation
      </Button>
    </div>
  );
};
