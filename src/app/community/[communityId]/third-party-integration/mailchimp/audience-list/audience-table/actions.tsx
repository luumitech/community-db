import React from 'react';
import { usePageContext } from '~/community/[communityId]/third-party-integration/page-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Link } from '~/view/base/link';
import type { AudienceMember } from '../_type';

interface Props {
  className?: string;
  item: AudienceMember;
}

export const Actions: React.FC<Props> = ({ className, item }) => {
  const { community } = usePageContext();
  const { property, occupant } = item;

  return (
    <div className="flex flex-nowrap">
      {property != null && (
        <Link
          href={appPath('property', {
            path: {
              communityId: community.id,
              propertyId: property.id,
            },
          })}
          tooltip={appLabel('property')}
          iconOnly={{
            icon: 'property-list',
            openInNewWindow: true,
          }}
        />
      )}
      {property != null && occupant != null && (
        <Link
          href={appPath('occupantEditor', {
            path: {
              communityId: community.id,
              propertyId: property.id,
            },
            query: {
              email: item.email_address,
            },
          })}
          tooltip={appLabel('occupantEditor')}
          iconOnly={{
            icon: 'contact-editor',
          }}
        />
      )}
    </div>
  );
};
