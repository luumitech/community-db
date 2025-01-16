import { getKeyValue } from '@nextui-org/react';
import React from 'react';
import { insertIf } from '~/lib/insert-if';
import { type AccessEntry } from './_type';
import { Action } from './action';
import { RoleInfo } from './role-info';
import { UserInfo } from './user-info';

export function useTableData(isAdmin: boolean) {
  const columns = [
    { key: 'user', label: 'User with access', className: undefined },
    { key: 'role', label: 'Role' },
    ...insertIf(isAdmin, { key: 'action', label: '' }),
  ];

  const renderCell = React.useCallback(
    (fragment: AccessEntry, columnKey: string | number) => {
      switch (columnKey) {
        case 'user':
          return <UserInfo fragment={fragment} />;
        case 'role':
          return <RoleInfo fragment={fragment} />;
        case 'action':
          return <Action fragment={fragment} />;

        default:
          return getKeyValue(fragment, columnKey);
      }
    },
    []
  );

  return { columns, renderCell };
}
