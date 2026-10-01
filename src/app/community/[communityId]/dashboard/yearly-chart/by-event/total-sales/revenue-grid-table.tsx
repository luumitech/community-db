import { Divider, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import {
  CLASS_DEFAULT,
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import { type RevenueEntry } from '../_type';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
export type ColumnKey = 'itemName' | 'count' | 'price' | 'paymentMethod';
type GridTableProps = GenericGTProps<ColumnKey, RevenueEntry & { id: string }>;
type GTProps = Required<GridTableProps>;
export type SortDescriptor = GTProps['sortDescriptor'];

type CustomGridTableProps = Omit<
  GridTableProps,
  'config' | 'renderHeader' | 'renderItem' | 'itemCardProps'
>;

export interface RevenueGridTableProps extends CustomGridTableProps {
  className?: string;
}

export const RevenueGridTable: React.FC<RevenueGridTableProps> = ({
  className,
  ...props
}) => {
  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'itemName':
        return 'Item Name';
      case 'count':
        return '#';
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

    const totalRow: RevenueEntry = {
      id: 'not-used',
      key: 'not-used',
      itemName: '',
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
      aria-label="Event Revenue"
      isHeaderSticky
      config={{
        gridContainer: className,
        headerSticky: cn(
          /** Matches Card's background color */
          'bg-content1'
        ),
        headerContainer: cn('mx-0.5 px-3 py-2'),
        bodyContainer: cn('px-2 py-1 text-sm', 'hover:bg-primary-50'),
        bottomContainer: cn(
          'sticky bottom-0 z-30',
          /** Matches Card's background color */
          'bg-content1',
          'grid grid-cols-subgrid'
        ),
      }}
      sortableColumnKeys={['itemName', 'count', 'price', 'paymentMethod']}
      renderHeader={renderHeader}
      renderItem={renderItem}
      bottomContent={bottomContent}
      {...props}
    />
  );
};
