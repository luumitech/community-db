import { cn } from '@heroui/react';
import React from 'react';
import { usePageContext } from '~/community/[communityId]/third-party-integration/page-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Link } from '~/view/base/link';
import type { Occupant, Property } from '../../_type';

interface Props {
  className?: string;
  property: Property;
  occupant: Occupant;
  email: string;
}

export const OccupantEditButton: React.FC<Props> = ({
  className,
  property,
  occupant,
  email,
}) => {
  const { community } = usePageContext();

  return (
    <Link
      href={appPath('occupantEditor', {
        path: {
          communityId: community.id,
          propertyId: property.id,
        },
        query: { email },
      })}
      tooltip={appLabel('occupantEditor')}
      tooltipProps={{ isFixed: true }}
      iconOnly={{
        icon: 'contact-editor',
      }}
    />
  );
};
