import { Button, Link, cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { appLabel } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  registerEvent?: GQL.RegisterEventMutation['registerEvent'];
  /** When 'Send Confirmation Email' is clicked */
  onSend?: () => void;
}

export const SuccessDialog: React.FC<Props> = ({
  className,
  registerEvent,
  onSend,
}) => {
  if (!registerEvent) {
    return null;
  }

  // Show email confirmation only when registering for the first event
  const { occupantList } = registerEvent.property;
  const hasEmail = occupantList.some(({ infoList }) =>
    infoList?.some(({ type }) => type === GQL.ContactInfoType.Email)
  );
  if (!hasEmail) {
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
        as={Link}
        color="primary"
        variant="faded"
        size="sm"
        endContent={<Icon icon="email" />}
        onPress={() => onSend?.()}
      >
        {appLabel('composeMembershipMail')}
      </Button>
    </div>
  );
};
