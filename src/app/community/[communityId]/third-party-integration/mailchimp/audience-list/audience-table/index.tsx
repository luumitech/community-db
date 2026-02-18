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
type ColumnKey =
  | 'email_address'
  | 'full_name'
  | 'status'
  | 'optOut'
  | 'warning'
  | 'actions';
type GridTableProps = GenericGTProps<ColumnKey, AudienceMember>;
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
  audienceListId?: string;
}

export const AudienceTable: React.FC<AudienceTableProps> = ({
  className,
  audienceListId,
  ...props
}) => {
  const { isSmDevice, isMdDevice } = useAppContext();

  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'email_address':
        return 'Email';
      case 'full_name':
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

  const renderItem: GTProps['renderItem'] = React.useCallback(
    (key, item) => {
      switch (key) {
        case 'email_address':
          // Make sure text is contained in one line
          return <span className="truncate">{item.email_address}</span>;
        case 'full_name':
          // Make sure text is contained in one line
          return <span className="truncate">{item.full_name}</span>;
        case 'status':
          return <MailchimpStatusChip status={item.status} />;
        case 'optOut':
          return <OptOut item={item} />;
        case 'warning':
          return <Warning item={item} />;
        case 'actions':
          return <Actions audienceListId={audienceListId} item={item} />;
      }
    },
    [audienceListId]
  );

  /**
   * Render Card border only for smaller viewport (when a row is collapsed into
   * multiple rows)
   */
  const cardHasBorder = React.useMemo(() => isMdDevice, [isMdDevice]);
  // Padding on each row (in the card)
  const CARD_PADDING_PX = cardHasBorder ? 8 : 4;

  const estimateSize = React.useCallback(() => {
    let height = rowHeight(isSmDevice ? 4 : isMdDevice ? 2 : 1);
    height += CARD_PADDING_PX * 2;
    return height;
  }, [isSmDevice, isMdDevice, CARD_PADDING_PX]);

  return (
    <GridTable
      aria-label="Mailchimp Audience List"
      isHeaderSticky
      virtualConfig={{
        isVirtualized: true,
        estimateSize,
        gap: cardHasBorder ? 8 : 0,
      }}
      config={{
        gridContainer: twMerge(
          'grid-cols-[repeat(2,minmax(0,1fr))_repeat(4,auto)]',
          'gap-2',
          className
        ),
        headerContainer: cn('mx-0.5 truncate px-3 py-2'),
        bodyContainer: cn(
          'mx-0.5 px-3',
          `py-[${CARD_PADDING_PX}]`,
          'hover:bg-primary-50',
          'items-center gap-0.5 text-sm'
        ),
      }}
      columnKeys={[
        'email_address',
        'full_name',
        'status',
        'optOut',
        'warning',
        'actions',
      ]}
      columnConfig={{
        email_address: cn(
          /**
           * Bold email, so it serves as a visual divider when a grid row
           * collapses into multiple rows
           */
          cardHasBorder && 'font-semibold md:font-normal',
          'col-span-full sm:col-span-3 md:col-span-1',
          'truncate'
        ),
        full_name: cn('col-span-full sm:col-span-3 md:col-span-1', 'truncate'),
        status: cn('col-span-2 sm:col-span-2 md:col-span-1'),
        optOut: cn('col-span-2 sm:col-span-1 md:col-span-1'),
        warning: cn('col-span-2 sm:col-span-1 md:col-span-1'),
        actions: cn('col-span-full sm:col-span-2 md:col-span-1'),
      }}
      sortableColumnKeys={[
        'email_address',
        'full_name',
        'status',
        'optOut',
        'warning',
      ]}
      renderHeader={renderHeader}
      renderItem={renderItem}
      {...props}
    />
  );
};

/** Helper function for calculating the height for each row */
function rowHeight(numLine: number) {
  /** Default height for each row */
  const lineHeight = 24;
  /** Gap-0.5 (in bodyContainer) is equivalent to 2px gap */
  const gap = 2;

  return lineHeight * numLine + gap * (numLine - 1);
}
