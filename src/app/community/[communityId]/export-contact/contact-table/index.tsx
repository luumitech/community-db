import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import {
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import type { ContactListEntry } from '../_type';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
const COLUMN_KEYS = ['firstName', 'lastName', 'email', 'address'] as const;
type GridTableProps = GenericGTProps<typeof COLUMN_KEYS, ContactListEntry>;
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

export interface ContactTableProps extends CustomGridTableProps {
  className?: string;
}

export const ContactTable: React.FC<ContactTableProps> = ({
  className,
  ...props
}) => {
  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'firstName':
        return 'First Name';
      case 'lastName':
        return 'Last Name';
      case 'email':
        return 'Email';
      case 'address':
        return 'Address';
    }
  }, []);

  const renderItem: GTProps['renderItem'] = React.useCallback((key, item) => {
    return <span>{item[key]}</span>;
  }, []);

  return (
    <GridTable
      aria-label="Contact Table"
      isHeaderSticky
      config={{
        gridContainer: twMerge(
          // Collapsed grid layout
          'grid-cols-2',
          // Normal grid layout
          'sm:grid-cols-[repeat(4,auto)]',
          className
        ),
        headerContainer: cn('p-2'),
        bodyContainer: cn('p-2 text-sm'),
      }}
      columnKeys={COLUMN_KEYS}
      columnConfig={{
        email: cn('col-span-2 sm:col-span-1'),
        address: cn('col-span-2 sm:col-span-1'),
      }}
      renderHeader={renderHeader}
      renderItem={renderItem}
      {...props}
    />
  );
};
