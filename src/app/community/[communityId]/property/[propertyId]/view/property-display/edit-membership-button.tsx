import { Link, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
}

export const EditMembershipButton: React.FC<Props> = ({ className }) => {
  const { community, property } = useLayoutContext();

  return (
    <Button
      className={className}
      as={Link}
      variant="faded"
      color="primary"
      tooltip={appLabel('membershipEditor')}
      isIconOnly
      href={appPath('membershipEditor', {
        path: { communityId: community.id, propertyId: property.id },
      })}
    >
      <Icon icon="edit" size={20} />
    </Button>
  );
};
