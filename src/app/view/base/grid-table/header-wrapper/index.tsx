import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from '../_config';
import type { CommonProps, HeaderRenderer, SortDescriptor } from '../_type';
import { Header } from './header';

export interface HeaderWrapperProps<C extends string> {
  /**
   * Should header be sticky?,
   *
   * - When sticky, you can customize the sticky CSS using config.headerSticky
   */
  isHeaderSticky?: boolean;
  /** The current sorted column and direction. */
  sortDescriptor?: SortDescriptor<C> | null;
  /** Handler that is called when the sorted column or direction changes. */
  onSortChange?: (descriptor: SortDescriptor<C> | null) => void;
  /** Render a custom component above the header */
  topContent?: React.ReactNode;
  renderHeader?: HeaderRenderer<C>;
}

interface Props extends CommonProps, HeaderWrapperProps<string> {}

export function HeaderWrapper(_props: Props) {
  const {
    isHeaderSticky,
    sortDescriptor,
    onSortChange,
    topContent,
    renderHeader,
    ...commonProps
  } = _props;

  if (!topContent && !renderHeader) {
    return null;
  }

  return (
    <div
      className={twMerge(
        CLASS_DEFAULT.inheritContainer,
        isHeaderSticky &&
          (commonProps.config?.headerSticky ?? CLASS_DEFAULT.headerSticky)
      )}
    >
      {!!topContent && <div className={cn('col-span-full')}>{topContent}</div>}
      {!!renderHeader && (
        <Header
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
          renderHeader={renderHeader}
          {...commonProps}
        />
      )}
    </div>
  );
}
