import { cn } from '@heroui/react';
import React from 'react';
import {
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import type { OccupantEntry } from '../_type';
import { ContactDetail } from './contact-detail';
import { ContactName } from './contact-name';
import { OptOut } from './opt-out';

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
type ColumnKey = 'name' | 'detail' | 'optOut';
type GridTableProps = GenericGTProps<ColumnKey, OccupantEntry>;
type GTProps = Required<GridTableProps>;

type CustomGridTableProps = Omit<
  GridTableProps,
  'config' | 'columnKeys' | 'columnConfig' | 'renderHeader' | 'renderItem'
>;

export interface OccupantTableProps extends CustomGridTableProps {
  className?: string;
}

export const OccupantTable: React.FC<OccupantTableProps> = ({
  className,
  ...props
}) => {
  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'name':
        return 'Name';
      case 'detail':
        return 'Contact Info';
      case 'optOut':
        return 'Opt out';
    }
  }, []);

  const renderItem: GTProps['renderItem'] = React.useCallback((key, item) => {
    switch (key) {
      case 'name':
        return <ContactName entry={item} />;
      case 'detail':
        return <ContactDetail contactInfoList={item.infoList} />;
      case 'optOut': {
        return <OptOut entry={item} />;
      }
    }
  }, []);

  const itemCardProps: GTProps['itemCardProps'] = React.useCallback((item) => {
    return {
      shadow: 'none',
    };
  }, []);

  return (
    <GridTable
      aria-label="Occupant Details Table"
      config={{
        gridContainer: cn(
          'gap-2',
          // 7 column layout
          'grid-cols-2 sm:grid-cols-7',
          className
        ),
        headerContainer: cn(
          'items-center',
          'rounded-lg',
          'h-8 px-3 py-0',
          // Hide header in small media query
          'hidden sm:grid'
        ),
        bodyContainer: cn('px-3', 'text-sm font-normal text-foreground'),
        bodyGrid: cn('gap-1'),
      }}
      itemCardProps={itemCardProps}
      columnKeys={['name', 'detail', 'optOut']}
      columnConfig={{
        name: 'sm:col-span-2',
        detail: 'col-span-2 sm:col-span-4',
        // Always last column
        optOut: '-col-start-1 row-start-1',
      }}
      renderHeader={renderHeader}
      renderItem={renderItem}
      {...props}
    />
  );
};
