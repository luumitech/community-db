import { cn } from '@heroui/react';
import React from 'react';
import { formatCurrency } from '~/lib/decimal-util';
import {
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import { type TicketStatEntry } from './_type';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
export type ColumnKey = 'eventName' | 'count' | 'price' | 'paymentMethod';
type GridTableProps = GenericGTProps<
  ColumnKey,
  TicketStatEntry & { id: string }
>;
type GTProps = Required<GridTableProps>;
export type SortDescriptor = GTProps['sortDescriptor'];

type CustomGridTableProps = Omit<
  GridTableProps,
  'config' | 'renderHeader' | 'renderItem' | 'itemCardProps'
>;

export interface TicketGridTableProps extends CustomGridTableProps {
  className?: string;
}

export const TicketGridTable: React.FC<TicketGridTableProps> = ({
  className,
  ...props
}) => {
  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'eventName':
        return 'Event Name';
      case 'count':
        // Don't want 'Ticket #' to wrap
        return <span className="whitespace-nowrap">Ticket #</span>;
      case 'price':
        return 'Price';
      case 'paymentMethod':
        return 'Payment Method';
    }
  }, []);

  const renderItem: GTProps['renderItem'] = React.useCallback((key, item) => {
    switch (key) {
      case 'count':
        return <span className="font-mono">{item[key]}</span>;

      case 'price':
        return (
          <div className="flex justify-between">
            <span className="pr-1 text-foreground/60">$</span>
            <span className="font-mono">{formatCurrency(item[key])}</span>
          </div>
        );

      default:
        return <span>{item[key]}</span>;
    }
  }, []);

  return (
    <GridTable
      aria-label="Membership Fee"
      isHeaderSticky
      config={{
        gridContainer: className,
        headerContainer: cn('mx-0.5 px-3 py-2'),
        bodyContainer: cn('px-2 py-1 text-sm', 'hover:bg-primary-50'),
      }}
      sortableColumnKeys={['eventName', 'count', 'price', 'paymentMethod']}
      renderHeader={renderHeader}
      renderItem={renderItem}
      {...props}
    />
  );
};
