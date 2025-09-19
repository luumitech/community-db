import { Tooltip, getKeyValue } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { Link } from '~/view/base/link';
import { usePageContext } from '../../page-context';
import { type AudienceMember } from './_type';
import { StatusChip } from './status-filter';

export function useTableData() {
  const router = useRouter();
  const { community } = usePageContext();

  const columns = [
    { key: 'email', label: 'Email', className: 'w-15' },
    { key: 'name', label: 'Name', className: 'w-15' },
    {
      key: 'status',
      label: <span className="text-wrap">Mailchimp Subscriber Status</span>,
    },
    { key: 'opt-out', label: 'Opt-Out' },
    { key: 'warning', label: 'Warning', allowsSorting: true },
    { key: 'property-link', label: 'Property', className: 'w-15' },
  ];

  const renderCell = React.useCallback(
    (entry: AudienceMember, columnKey: string | number) => {
      const { property, occupant } = entry;

      switch (columnKey) {
        case 'email':
          return <span>{entry.email}</span>;
        case 'name':
          return <span>{entry.fullName}</span>;
        case 'status':
          return <StatusChip status={entry.status} />;
        case 'opt-out':
          return occupant?.optOut ? <Icon icon="checkmark" size={16} /> : null;
        case 'warning':
          return entry.warning ? (
            <Tooltip
              content={
                <div className="max-w-48 text-tiny text-wrap">
                  {entry.warning}
                </div>
              }
            >
              <div>
                <Icon className="text-warning" icon="warning" size={16} />
              </div>
            </Tooltip>
          ) : null;
        case 'property-link':
          if (property == null) {
            return null;
          }
          return (
            <Link
              href={appPath('property', {
                path: {
                  communityId: community.id,
                  propertyId: property.id,
                },
              })}
              iconOnly={{
                icon: 'property-editor',
                tooltip: appLabel('property'),
                openInNewWindow: true,
              }}
            />
          );

        default:
          return getKeyValue(entry, columnKey);
      }
    },
    [community]
  );

  return { columns, renderCell };
}
