import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { MailchimpStatusChip } from '~/community/[communityId]/common/chip';
import { useAppContext } from '~/custom-hooks/app-context';
import {
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
export type SortDescriptor = GTProps['sortDescriptor'];

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
  const { isSmDevice, isMdDevice } = useAppContext();

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
        // Make sure text is contained in one line
        return (
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {item.email}
          </span>
        );
      case 'fullName':
        // Make sure text is contained in one line
        return (
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {item.fullName}
          </span>
        );
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
      virtualConfig={{
        isVirtualized: true,
        estimateSize: () => rowHeight(isSmDevice ? 4 : isMdDevice ? 2 : 1),
      }}
      config={{
        gridContainer: twMerge('grid-cols-[repeat(6,auto)]', className),
        headerSticky: cn('sticky top-0 z-50 bg-background'),
        headerContainer: cn('mx-0.5 px-3 py-2 whitespace-nowrap'),
        headerGrid: cn('gap-2'),
        bodyContainer: cn('mx-0.5 px-3 py-0'),
        bodyGrid: cn('items-center gap-0.5 text-sm'),
      }}
      columnKeys={COLUMN_KEYS}
      columnConfig={{
        email: cn(
          'font-semibold md:font-normal',
          'col-span-full sm:col-span-3 md:col-span-1'
        ),
        fullName: cn('col-span-full sm:col-span-3 md:col-span-1'),
        status: cn('col-span-2', 'md:col-span-1'),
        optOut: cn(
          'col-span-2 sm:col-span-1 md:col-span-1',
          // center only on full width
          'md:flex md:justify-center'
        ),
        warning: cn(
          'col-span-2 sm:col-span-1 md:col-span-1',
          // center only on full width
          'md:flex md:justify-center'
        ),
        actions: cn(
          'col-span-full sm:col-span-1 md:col-span-1',
          // center only on full width
          'md:flex md:justify-center'
        ),
      }}
      sortableColumnKeys={['email', 'fullName', 'status', 'optOut', 'warning']}
      renderHeader={renderHeader}
      renderItem={renderItem}
      itemCardProps={itemCardProps}
      {...props}
    />
  );
};

/** Helper function for calculating the height for each row */
function rowHeight(numLine: number) {
  /** Default height for each row */
  const lineHeight = 24;
  /** BodyGrid gap-0.5 is equivalent to 2px gap */
  const gap = 2;

  return lineHeight * numLine + gap * (numLine - 1);
}
