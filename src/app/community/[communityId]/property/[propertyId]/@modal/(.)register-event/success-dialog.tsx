import { Button, Link, cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { useLayoutContext } from '../../layout-context';

interface Props {
  className?: string;
  membershipYear: string;
  registerEvent?: GQL.RegisterEventMutation['registerEvent'];
  closeToast?: () => void;
}

export const SuccessDialog: React.FC<Props> = ({
  className,
  membershipYear,
  registerEvent,
  closeToast,
}) => {
  const { community, property } = useLayoutContext();

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
        as={Link}
        color="primary"
        variant="faded"
        size="sm"
        endContent={<Icon icon="email" />}
        onPress={() => {
          closeToast?.();
        }}
        href={appPath('sendMail', {
          path: { communityId: community.id, propertyId: property.id },
          query: {
            membershipYear,
          },
        })}
      >
        Compose Confirmation Email
      </Button>
    </div>
  );
};
