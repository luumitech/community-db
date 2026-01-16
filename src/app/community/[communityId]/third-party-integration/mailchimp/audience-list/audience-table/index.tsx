import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { MailchimpStatusChip } from '~/community/[communityId]/common/chip';
import {
  CLASS_DEFAULT,
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import type { AudienceMember } from '../_type';
import { Actions } from './actions';
import { OptOut } from './opt-out';
import { Warning } from './warning';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
const COLUMN_KEYS = [
  'email',
  'fullName',
  'status',
  'optOut',
  'warning',
  'actions',
] as const;
type GridTableProps = GenericGTProps<typeof COLUMN_KEYS, AudienceMember>;
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

export interface AudienceTableProps extends CustomGridTableProps {
  className?: string;
}

export const AudienceTable: React.FC<AudienceTableProps> = ({
  className,
  ...props
}) => {
  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'email':
        return 'Email';
      case 'fullName':
        return 'Name';
      case 'status':
        return 'Subscriber Status';
      case 'optOut':
        return 'Opt-Out';
      case 'warning':
        return 'Warning';
      case 'actions':
        return 'Actions';
    }
  }, []);

  const renderItem: GTProps['renderItem'] = React.useCallback((key, item) => {
    switch (key) {
      case 'email':
        return item.email;
      case 'fullName':
        return item.fullName;
      case 'status':
        return <MailchimpStatusChip status={item.status} />;
      case 'optOut':
        return <OptOut item={item} />;
      case 'warning':
        return <Warning item={item} />;
      case 'actions':
        return <Actions item={item} />;
    }
  }, []);

  const itemCardProps: GTProps['itemCardProps'] = React.useCallback((item) => {
    return {
      shadow: 'none',
    };
  }, []);

  return (
    <GridTable
      aria-label="Mailchimp Audience List"
      isHeaderSticky
      config={{
        gridContainer: twMerge(
          // Collapsed grid layout
          'grid-cols-[repeat(6,auto)]',
          // Normal grid layout
          'sm:grid-cols-[repeat(6,auto)]',
          className
        ),
        headerSticky: cn('sticky top-0 z-50 bg-background'),
        headerContainer: cn('mx-0.5 px-3 py-2 whitespace-nowrap'),
        headerGrid: cn('gap-2'),
        bodyContainer: cn('mx-0.5 px-3 py-0'),
        bodyGrid: cn('items-center gap-2 text-sm'),
      }}
      columnKeys={COLUMN_KEYS}
      columnConfig={{
        email: cn('col-span-full sm:col-span-1'),
        fullName: cn('col-span-full sm:col-span-1'),
        status: cn('col-span-full sm:col-span-1'),
        optOut: cn('flex justify-center', 'col-span-full sm:col-span-1'),
        warning: cn('flex justify-center', 'col-span-full sm:col-span-1'),
        actions: cn('flex justify-center', 'col-span-full sm:col-span-1'),
      }}
      renderHeader={renderHeader}
      renderItem={renderItem}
      itemCardProps={itemCardProps}
      {...props}
    />
  );
};
