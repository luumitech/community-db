import { Divider, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import {
  CLASS_DEFAULT,
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import { type TicketStatEntry } from '../_type';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
export type ColumnKey = 'ticketName' | 'count' | 'price' | 'paymentMethod';
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
      case 'ticketName':
        return 'Ticket';
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

  /** Render a total line at the bottom of the table */
  const bottomContent = React.useMemo(() => {
    if (!props.items.length) {
      return null;
    }

    const totalRow: TicketStatEntry = {
      id: 'not-used',
      key: 'not-used',
      membershipYear: NaN,
      ticketName: '',
      eventName: 'not-used',
      count: R.sumBy(props.items, ({ count }) => count),
      price: decSum(...props.items.map(({ price }) => price)),
      paymentMethod: '',
    };

    return (
      <>
        <Divider className="col-span-full" />
        <div
          className={cn(
            CLASS_DEFAULT.inheritContainer,
            CLASS_DEFAULT.commonContainer,
            CLASS_DEFAULT.bodyContainer,
            'px-2 py-1 text-sm'
          )}
        >
          {props.columnKeys.map((key) => (
            <div key={`${key}-total`} className={props.columnConfig?.[key]}>
              {renderItem(key, totalRow)}
            </div>
          ))}
        </div>
      </>
    );
  }, [props.columnConfig, props.columnKeys, props.items, renderItem]);

  return (
    <GridTable
      aria-label="Ticket Sale"
      isHeaderSticky
      config={{
        gridContainer: className,
        headerContainer: cn('mx-0.5 px-3 py-2'),
        bodyContainer: cn('px-2 py-1 text-sm', 'hover:bg-primary-50'),
        bottomContainer: cn(
          'sticky bottom-0 z-30',
          /** Matches the default background color */
          'bg-background',
          'grid grid-cols-subgrid'
        ),
      }}
      sortableColumnKeys={['ticketName', 'count', 'price', 'paymentMethod']}
      renderHeader={renderHeader}
      renderItem={renderItem}
      bottomContent={bottomContent}
      {...props}
    />
  );
};
