import { cn } from '@heroui/react';
import React from 'react';
import { formatCurrency } from '~/lib/decimal-util';
import {
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import type { TicketRowEntry } from '../ticket-util';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
type ColumnKey = 'eventName' | 'eventDate' | 'ticketCount' | 'ticketPrice';
type GridTableProps = GenericGTProps<ColumnKey, TicketRowEntry>;
type GTProps = Required<GridTableProps>;

type CustomGridTableProps = Omit<
  GridTableProps,
  'config' | 'columnKeys' | 'columnConfig' | 'renderHeader' | 'renderItem'
>;

export interface TicketTableProps extends CustomGridTableProps {
  className?: string;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  className,
  ...props
}) => {
  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'eventName':
        return <span className="truncate">Event</span>;
      case 'eventDate':
        return <span className="truncate">Date</span>;
      case 'ticketCount':
        return <span className="truncate">Count</span>;
      case 'ticketPrice':
        return <span className="truncate">Cost</span>;
    }
  }, []);

  const renderItem: GTProps['renderItem'] = React.useCallback((key, item) => {
    switch (key) {
      case 'eventName':
        return item.eventName;
      case 'eventDate':
        return item.eventDate;
      case 'ticketCount':
        return item.ticketCount;
      case 'ticketPrice':
        return (
          <div className="truncate">
            <span className="pr-0.5 text-default-400">$</span>
            <span>{formatCurrency(item.ticketPrice)}</span>
          </div>
        );
    }
  }, []);

  return (
    <GridTable
      aria-label="Ticket Status Table"
      isHeaderSticky
      config={{
        gridContainer: cn('gap-2', 'grid-cols-6', className),
        headerContainer: cn(
          'items-center',
          'rounded-lg',
          'h-8 px-3 py-0',
          // Hide header in small media query
          'hidden sm:grid'
        ),
        headerSticky: cn('bg-content1'),
        bodyContainer: cn('px-3', 'text-sm font-normal text-foreground'),
      }}
      columnKeys={['eventName', 'eventDate', 'ticketCount', 'ticketPrice']}
      columnConfig={{
        eventName: cn('col-span-2 truncate'),
        eventDate: cn('col-span-2 truncate'),
        ticketCount: cn('truncate'),
        ticketPrice: cn('truncate'),
      }}
      renderHeader={renderHeader}
      renderItem={renderItem}
      {...props}
    />
  );
};
