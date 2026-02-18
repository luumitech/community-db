import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from '../_config';
import type {
  CommonProps,
  HeaderContainerRenderer,
  HeaderRenderer,
  SortDescriptor,
} from '../_type';
import { SortIndicator } from './sort-indicator';

/** Properties in HeaderContainerProps */
export const HEADER_CONTAINER_PROPS = [
  'sortDescriptor',
  'onSortChange',
  'renderHeaderContainer',
] as const;

export interface HeaderContainerProps<ColumnKey extends Readonly<string>> {
  /** The current sorted column and direction. */
  sortDescriptor?: SortDescriptor<ColumnKey> | null;
  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: SortDescriptor<ColumnKey> | null) => void;
  /**
   * Optional header container component. By default, it renders a simple div
   * component with minimal styling
   */
  renderHeaderContainer?: HeaderContainerRenderer;
}

interface Props<ColumnKey extends Readonly<string>>
  extends HeaderContainerProps<ColumnKey>, CommonProps<ColumnKey> {
  renderHeader: HeaderRenderer<ColumnKey>;
}

export function HeaderContainer<ColumnKey extends Readonly<string>>(
  props: Props<ColumnKey>
) {
  const { renderHeader } = props;
  const commonProps = R.pick(props, COMMON_PROPS);
  const headerContainerProps = R.pick(props, HEADER_CONTAINER_PROPS);
  const { renderHeaderContainer } = headerContainerProps;
  const { config, sortableColumnKeys, columnKeys, columnConfig } = commonProps;

  const sortDirection = React.useCallback(
    (columnKey: ColumnKey) => {
      const { sortDescriptor } = props;
      return sortDescriptor?.columnKey === columnKey
        ? sortDescriptor.direction
        : null;
    },
    [props]
  );

  const onSortPressed = React.useCallback(
    (columnKey: ColumnKey) => () => {
      const { onSortChange } = props;
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
    [props, sortDirection]
  );

  const defaultContainer = React.useCallback<HeaderContainerRenderer>(
    (arg) => <div {...arg} />,
    []
  );

  return (renderHeaderContainer ?? defaultContainer)({
    className: twMerge(
      CLASS_DEFAULT.inheritContainer,
      CLASS_DEFAULT.commonContainer,
      CLASS_DEFAULT.headerContainer,
      config?.commonContainer,
      config?.headerContainer
    ),
    role: 'columnheader',
    children: columnKeys.map((key) => {
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
          {sortEnabled && <SortIndicator sortDirection={sortDirection(key)} />}
        </div>
      );
    }),
  });
}
