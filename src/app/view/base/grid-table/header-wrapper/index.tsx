import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS, HEADER_PROPS } from '../_config';
import type { CommonProps, HeaderRenderer, SortDescriptor } from '../_type';
import { Header } from './header';

/**
 * List of props for header
 *
 * - NOTE: Update HEADER_PROPS in '_type.ts' if adding or removing properties here
 */
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

export function HeaderWrapper(props: Props) {
  const _headerProps = R.pick(props, HEADER_PROPS);
  const commonProps = R.pick(props, COMMON_PROPS);
  const { isHeaderSticky, topContent, renderHeader, ...headerProps } =
    _headerProps;

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
        <Header renderHeader={renderHeader} {...headerProps} {...commonProps} />
      )}
    </div>
  );
}
