import { getKeyValue } from '@nextui-org/react';
import React from 'react';
import { type AccessEntry } from './_type';
import { Action } from './action';
import { RoleInfo } from './role-info';
import { UserInfo } from './user-info';

export function useTableData() {
  const columns = [
    { key: 'user', label: 'User with access', className: undefined },
    { key: 'role', label: 'Role' },
    { key: 'action', label: 'Action' },
  ];

  const renderCell = React.useCallback(
    (entry: AccessEntry, columnKey: string | number) => {
      switch (columnKey) {
        case 'user':
          return <UserInfo entry={entry} isSelf={entry.isSelf} />;
        case 'role':
          return <RoleInfo entry={entry} />;
        case 'action':
          return <Action entry={entry} isSelf={entry.isSelf} />;

        default:
          return getKeyValue(entry, columnKey);
      }
    },
    []
  );

  return { columns, renderCell };
}
