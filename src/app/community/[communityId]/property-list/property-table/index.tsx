import { Card, CardBody, cn } from '@heroui/react';
import React from 'react';
import {
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import type { PropertyEntry } from '../_type';
import { MemberYear } from './member-year';
import { Occupant } from './occupant';
import { PropertyAddress } from './property-address';
import { useMemberYear } from './use-member-year';

export { Occupant } from './occupant';
export { PropertyAddress } from './property-address';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
type ColumnKey = 'address' | 'member' | 'memberYear';
type GridTableProps = GenericGTProps<ColumnKey, PropertyEntry>;
type GTProps = Required<GridTableProps>;

type CustomGridTableProps = Omit<
  GridTableProps,
  'config' | 'columnKeys' | 'columnConfig' | 'renderHeader' | 'renderItem'
>;

export interface PropertyTableProps extends CustomGridTableProps {
  className?: string;
  /** Display header row */
  showHeader?: boolean;
  onItemPress?: (item: PropertyEntry) => void;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  className,
  showHeader,
  onItemPress,
  ...props
}) => {
  const yearsToShow = useMemberYear();

  const renderHeader: GTProps['renderHeader'] = React.useCallback(
    (key) => {
      switch (key) {
        case 'address':
          return 'Address';
        case 'member':
          return (
            <div
              className={cn(
                // Hide in small screen
                'hidden sm:grid'
              )}
            >
              Member Names
            </div>
          );
        case 'memberYear':
          return (
            <div
              className={cn(
                'grid auto-cols-fr grid-flow-col grid-rows-1',
                'items-center gap-2'
              )}
            >
              {yearsToShow.map((year) => (
                <span key={year} className="m-auto">
                  {year}
                </span>
              ))}
            </div>
          );
      }
    },
    [yearsToShow]
  );

  const renderItem: GTProps['renderItem'] = React.useCallback(
    (key, item) => {
      switch (key) {
        case 'address':
          return <PropertyAddress fragment={item} />;
        case 'member':
          return <Occupant fragment={item} />;
        case 'memberYear':
          return (
            <MemberYear
              item={item}
              // Display year header when header row is not shown
              showYearHeader={!showHeader}
            />
          );
      }
    },
    [showHeader]
  );

  const renderItemContainer: GTProps['renderItemContainer'] = React.useCallback(
    (item, containerProps) => {
      const { children, ...otherContainerProps } = containerProps;

      return (
        <Card
          shadow="sm"
          {...otherContainerProps}
          {...(onItemPress && {
            isPressable: true,
            onPress: () => onItemPress(item),
          })}
        >
          <CardBody
            className={cn(
              // inherit grid setting
              'col-span-full grid grid-cols-subgrid',
              // Override default padding
              'p-0',
              'gap-1 overflow-hidden'
            )}
          >
            {children}
          </CardBody>
        </Card>
      );
    },
    [onItemPress]
  );

  return (
    <GridTable
      aria-label="Property Table"
      isHeaderSticky
      config={{
        gridContainer: cn(
          'grid-cols-[repeat(6,1fr)_max-content]',
          'gap-2',
          className
        ),
        headerSticky: cn('top-header-height'),
        headerContainer: cn('mx-0.5 px-3 py-2'),
        bodyContainer: cn(
          'mx-0.5 p-3',
          // Hover styling if item is pressable
          onItemPress && 'hover:bg-primary-50'
        ),
      }}
      columnKeys={['address', 'member', 'memberYear']}
      columnConfig={{
        address: cn('col-span-6 sm:col-span-2'),
        member: cn('col-span-6 sm:col-span-4'),
        memberYear: cn(
          // Always last column
          '-col-start-1 row-start-1',
          // when collapsed, column spans both rows
          'row-span-2 sm:row-span-1'
        ),
      }}
      {...(!!showHeader && { renderHeader })}
      renderItemContainer={renderItemContainer}
      renderItem={renderItem}
      {...props}
    />
  );
};
