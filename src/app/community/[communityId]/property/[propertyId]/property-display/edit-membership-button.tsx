import { Link, cn } from '@heroui/react';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { FlatButton } from '~/view/base/flat-button';
import { useLayoutContext } from '../layout-context';

interface Props {
  className?: string;
}

export const EditMembershipButton: React.FC<Props> = ({ className }) => {
  const { community, property } = useLayoutContext();

  return (
    <Link
      className={cn(className)}
      href={appPath('membershipEditor', {
        path: { communityId: community.id, propertyId: property.id },
      })}
    >
      <FlatButton
        className="text-primary"
        icon="edit"
        tooltip={appLabel('membershipEditor')}
      />
    </Link>
  );
};
