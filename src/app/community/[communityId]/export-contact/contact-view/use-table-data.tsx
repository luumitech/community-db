import { getKeyValue } from '@heroui/react';
import React from 'react';
import { type ContactListEntry } from '../contact-util';

export function useTableData() {
  const columns = [
    { key: 'firstName', label: 'First Name', className: 'w-10' },
    { key: 'lastName', label: 'Last Name', className: 'w-10' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address', className: 'w-15' },
  ];

  const renderCell = React.useCallback(
    (entry: ContactListEntry, columnKey: string | number) => {
      switch (columnKey) {
        case 'address':
          return <span>{entry.address}</span>;
        case 'firstName':
          return <span>{entry.firstName}</span>;
        case 'lastName':
          return <span>{entry.lastName}</span>;
        case 'email':
          return <span>{entry.email}</span>;
        default:
          return getKeyValue(entry, columnKey);
      }
    },
    []
  );

  return { columns, renderCell };
}
