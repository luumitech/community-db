import { Divider, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import {
  CLASS_DEFAULT,
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import { type MembershipFeeStatEntry } from './_type';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
export type ColumnKey =
  | 'membershipYear'
  | 'eventName'
  | 'count'
  | 'price'
  | 'paymentMethod';
type GridTableProps = GenericGTProps<
  ColumnKey,
  MembershipFeeStatEntry & { id: string }
>;
type GTProps = Required<GridTableProps>;
export type SortDescriptor = GTProps['sortDescriptor'];

type CustomGridTableProps = Omit<
  GridTableProps,
  'config' | 'renderHeader' | 'renderItem' | 'itemCardProps'
>;

export interface FeeGridTableProps extends CustomGridTableProps {
  className?: string;
}

export const FeeGridTable: React.FC<FeeGridTableProps> = ({
  className,
  ...props
}) => {
  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'membershipYear':
        return 'Membership Year';
      case 'eventName':
        return 'Event Name';
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

      case 'membershipYear':
        if (!isNaN(item[key])) {
          return <span>{item[key]}</span>;
        }
        break;

      default:
        return <span>{item[key]}</span>;
    }
    return null;
  }, []);

  /** Render a total line at the bottom of the table */
  const bottomContent = React.useMemo(() => {
    if (!props.items.length) {
      return null;
    }

    const totalRow: MembershipFeeStatEntry = {
      id: 'not-used',
      key: 'not-used',
      membershipYear: NaN,
      eventName: '',
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
      aria-label="Membership Fee"
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

          'grid grid-cols-subgrid',
          /** Matches Card's background color */
          'bg-content1'
        ),
      }}
      sortableColumnKeys={[
        'membershipYear',
        'eventName',
        'count',
        'price',
        'paymentMethod',
      ]}
      renderHeader={renderHeader}
      renderItem={renderItem}
      bottomContent={bottomContent}
      {...props}
    />
  );
};
