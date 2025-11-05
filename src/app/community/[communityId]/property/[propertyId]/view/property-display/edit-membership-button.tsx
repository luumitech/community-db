import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Link } from '~/view/base/link';

interface Props {
  className?: string;
}

export const EditMembershipButton: React.FC<Props> = ({ className }) => {
  const { community, property } = useLayoutContext();

  return (
    <Link
      className={className}
      href={appPath('membershipEditor', {
        path: { communityId: community.id, propertyId: property.id },
      })}
      tooltip={appLabel('membershipEditor')}
      iconOnly={{
        icon: 'edit',
      }}
    />
  );
};
