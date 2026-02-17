import { Card, CardBody, cn, type CardProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from '../_config';
import type { CommonProps, HeaderRenderer, SortDescriptor } from '../_type';
import { SortIndicator } from './sort-indicator';

interface Props<ColumnKey extends Readonly<string>>
  extends CardProps, CommonProps<ColumnKey> {
  /** The current sorted column and direction. */
  sortDescriptor?: SortDescriptor<ColumnKey> | null;
  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: SortDescriptor<ColumnKey> | null) => void;
  renderHeader: HeaderRenderer<ColumnKey>;
}

export function HeaderContainer<ColumnKey extends Readonly<string>>(
  props: Props<ColumnKey>
) {
  const { sortDescriptor, onSortChange, renderHeader, ...otherProps } = props;
  const commonProps = R.pick(props, COMMON_PROPS);
  const cardProps = R.omit(otherProps, COMMON_PROPS);
  const { config, sortableColumnKeys, columnKeys, columnConfig } = commonProps;

  const sortDirection = React.useCallback(
    (columnKey: ColumnKey) => {
      return sortDescriptor?.columnKey === columnKey
        ? sortDescriptor.direction
        : null;
    },
    [sortDescriptor]
  );

  const onSortPressed = React.useCallback(
    (columnKey: ColumnKey) => () => {
      const direction = sortDirection(columnKey);
      switch (direction) {
        case 'ascending':
          return onSortChange?.({ columnKey, direction: 'descending' });
        case 'descending':
          return onSortChange?.(null);
        case null:
          return onSortChange?.({ columnKey, direction: 'ascending' });
      }
    },
    [onSortChange, sortDirection]
  );

  return (
    <Card
      className={twMerge(
        CLASS_DEFAULT.inheritContainer,
        CLASS_DEFAULT.commonContainer,
        CLASS_DEFAULT.headerContainer,
        config?.commonContainer,
        config?.headerContainer
      )}
      role="columnheader"
      shadow="none"
      radius="sm"
      {...cardProps}
    >
      <CardBody
        className={twMerge(
          // Override default padding in CardBody
          'p-0',
          CLASS_DEFAULT.inheritContainer,
          CLASS_DEFAULT.headerGrid,
          config?.headerGrid
        )}
      >
        {columnKeys.map((key) => {
          const sortEnabled = !!sortableColumnKeys?.includes(key);

          return (
            <div
              key={key}
              className={twMerge(
                'flex items-center gap-1',
                sortEnabled && 'cursor-pointer hover:opacity-hover',
                columnConfig?.[key]
              )}
              {...(sortEnabled && { onClick: onSortPressed(key) })}
            >
              {renderHeader(key)}
              {sortEnabled && (
                <SortIndicator sortDirection={sortDirection(key)} />
              )}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
