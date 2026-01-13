import { Tooltip, getKeyValue } from '@heroui/react';
import React from 'react';
import { MailchimpStatusChip } from '~/community/[communityId]/common/chip';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { Link } from '~/view/base/link';
import { usePageContext } from '../../page-context';
import { type AudienceMember } from './_type';

export function useTableData() {
  const { community } = usePageContext();

  const columns = [
    { key: 'email', label: 'Email', allowsSorting: true, className: '' },
    { key: 'fullName', label: 'Name', allowsSorting: true },
    {
      key: 'status',
      label: <span className="text-wrap">Subscriber Status</span>,
      allowsSorting: true,
    },
    { key: 'opt-out', label: 'Opt-Out', allowsSorting: true },
    { key: 'warning', label: 'Warning', allowsSorting: true },
    { key: 'actions', label: 'Actions' },
  ];

  const renderCell = React.useCallback(
    (entry: AudienceMember, columnKey: string | number) => {
      const { property, occupant } = entry;

      switch (columnKey) {
        case 'email':
          return <span>{entry.email}</span>;
        case 'fullName':
          return <span>{entry.fullName}</span>;
        case 'status':
          return <MailchimpStatusChip status={entry.status} />;
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
        case 'actions':
          if (property == null) {
            return null;
          }
          return (
            <div>
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
              <Link
                href={appPath('occupantEditor', {
                  path: {
                    communityId: community.id,
                    propertyId: property.id,
                  },
                  query: {
                    email: entry.email,
                  },
                })}
                tooltip={appLabel('occupantEditor')}
                iconOnly={{
                  icon: 'contact-editor',
                }}
              />
            </div>
          );

        default:
          return getKeyValue(entry, columnKey);
      }
    },
    [community]
  );

  return { columns, renderCell };
}
