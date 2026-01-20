import { Card, CardBody, cn, type CardProps } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from '../_config';
import type { CommonProps, HeaderRenderer, SortDescriptor } from '../_type';
import { SortIndicator } from './sort-indicator';

interface Props extends CardProps, CommonProps {
  /** The current sorted column and direction. */
  sortDescriptor?: SortDescriptor<string> | null;
  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: SortDescriptor<string> | null) => void;
  renderHeader: HeaderRenderer<string>;
}

export function Header(_props: Props) {
  const {
    config,
    sortableColumnKeys,
    columnKeys,
    columnConfig,
    sortDescriptor,
    onSortChange,
    renderHeader,
    ...props
  } = _props;

  const sortDirection = React.useCallback(
    (columnKey: string) => {
      return sortDescriptor?.columnKey === columnKey
        ? sortDescriptor.direction
        : null;
    },
    [sortDescriptor]
  );

  const onSortPressed = React.useCallback(
    (columnKey: string) => () => {
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
      {...props}
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
