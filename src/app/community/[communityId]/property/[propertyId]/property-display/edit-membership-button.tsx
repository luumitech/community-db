import { cn } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { FlatButton } from '~/view/base/flat-button';
import { useLayoutContext } from '../layout-context';

interface Props {
  className?: string;
}

export const EditMembershipButton: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { community, property } = useLayoutContext();

  return (
    <div className={cn(className)}>
      <FlatButton
        className="text-primary"
        icon="edit"
        tooltip={appLabel('membershipEditor')}
        onClick={() => {
          router.push(
            appPath('membershipEditor', {
              path: { communityId: community.id, propertyId: property.id },
            })
          );
        }}
      />
    </div>
  );
};
