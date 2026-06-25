import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useSelector } from '~/custom-hooks/redux';
import { insertIf } from '~/lib/insert-if';
import {
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import type { AccessEntry, CommunityEntry } from '../_type';
import { Action } from './action';
import { RoleInfo } from './role-info';
import { UserInfo } from './user-info';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
type ColumnKey = 'user' | 'role' | 'actions';
type GridTableProps = GenericGTProps<ColumnKey, AccessEntry>;
type GTProps = Required<GridTableProps>;

type CustomGridTableProps = Omit<
  GridTableProps,
  | 'config'
  | 'columnKeys'
  | 'columnConfig'
  | 'renderHeader'
  | 'renderItem'
  | 'itemCardProps'
>;

export interface AccessTableProps extends CustomGridTableProps {
  className?: string;
  community?: CommunityEntry;
  /** Don't show the role column */
  hideRole?: boolean;
  /** Don't show the action column (prevents user from editing role) */
  hideAction?: boolean;
}

export const AccessTable: React.FC<AccessTableProps> = ({
  className,
  community,
  hideRole,
  hideAction: _hideAction,
  ...props
}) => {
  const { isAdmin } = useSelector((state) => state.community);
  // Only admin is allowed to manage access
  const hideAction = !isAdmin || !!_hideAction;

  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'user':
        return 'User with access';
      case 'role':
        return 'Role';
      case 'actions':
        return '';
    }
  }, []);

  const renderItem: GTProps['renderItem'] = React.useCallback(
    (key, item) => {
      switch (key) {
        case 'user':
          return <UserInfo fragment={item} />;
        case 'role':
          return <RoleInfo fragment={item} />;
        case 'actions':
          return (
            community != null && (
              <Action
                className="justify-end"
                community={community}
                fragment={item}
              />
            )
          );
      }
    },
    [community]
  );

  let columnClsNm;
  if (hideAction && hideRole) {
    columnClsNm = twMerge('grid-cols-4');
  } else if (hideAction) {
    columnClsNm = twMerge('grid-cols-5');
  } else if (hideRole) {
    columnClsNm = twMerge('grid-cols-[repeat(4,minmax(0,1fr))_auto]');
  } else {
    // Show all columns
    columnClsNm = twMerge('grid-cols-[repeat(5,minmax(0,1fr))_auto]');
  }

  return (
    <GridTable
      aria-label="Community Access Management Table"
      isHeaderSticky
      config={{
        gridContainer: twMerge(columnClsNm, 'gap-0', className),
        headerSticky: cn('mb-2'),
        headerContainer: cn('mx-0.5 px-3 py-2'),
        bodyContainer: cn(
          'mx-0.5 h-max px-3 py-1',
          'hover:bg-primary-50',
          'items-center gap-1 overflow-hidden'
        ),
      }}
      columnConfig={{
        user: cn('col-span-4'),
        role: cn('col-span-1'),
        actions: cn('col-span-1'),
      }}
      columnKeys={[
        'user',
        ...insertIf<'role'>(!hideRole, 'role'),
        ...insertIf<'actions'>(!hideAction, 'actions'),
      ]}
      renderHeader={renderHeader}
      renderItem={renderItem}
      {...props}
    />
  );
};
