import { cn } from '@heroui/react';
import React from 'react';
import { usePageContext } from '~/community/[communityId]/third-party-integration/page-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Link } from '~/view/base/link';
import type { Property } from '../../_type';

interface Props {
  className?: string;
  property: Property;
}

export const PropertyViewButton: React.FC<Props> = ({
  className,
  property,
}) => {
  const { community } = usePageContext();

  return (
    <Link
      className={className}
      href={appPath('property', {
        path: {
          communityId: community.id,
          propertyId: property.id,
        },
      })}
      tooltip={appLabel('property')}
      tooltipProps={{ isFixed: true }}
      iconOnly={{
        icon: 'property-list',
        openInNewWindow: true,
      }}
    />
  );
};
