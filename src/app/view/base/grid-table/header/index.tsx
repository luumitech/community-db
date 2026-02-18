import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from '../_config';
import type { CommonProps, HeaderRenderer } from '../_type';
import {
  HEADER_CONTAINER_PROPS,
  HeaderContainer,
  type HeaderContainerProps,
} from './header-container';

/**
 * List of props for header
 *
 * - NOTE: Update HEADER_PROPS in '_type.ts' if adding or removing properties here
 */
export interface HeaderProps<
  ColumnKey extends Readonly<string>,
> extends HeaderContainerProps<ColumnKey> {
  /**
   * Should header be sticky?,
   *
   * - When sticky, you can customize the sticky CSS using config.headerSticky
   */
  isHeaderSticky?: boolean;
  /** Render a custom component above the header */
  topContent?: React.ReactNode;
  renderHeader?: HeaderRenderer<ColumnKey>;
}

interface Props<ColumnKey extends Readonly<string>>
  extends CommonProps<ColumnKey>, HeaderProps<ColumnKey> {}

export function Header<ColumnKey extends Readonly<string>>(
  props: Props<ColumnKey>
) {
  const { isHeaderSticky, topContent, renderHeader } = props;
  const headerContainerProps = R.pick(props, HEADER_CONTAINER_PROPS);
  const commonProps = R.pick(props, COMMON_PROPS);

  if (!topContent && !renderHeader) {
    return null;
  }

  return (
    <div
      className={twMerge(
        CLASS_DEFAULT.inheritContainer,
        isHeaderSticky && CLASS_DEFAULT.headerSticky,
        isHeaderSticky && commonProps.config?.headerSticky
      )}
    >
      {!!topContent && <div className={cn('col-span-full')}>{topContent}</div>}
      {!!renderHeader && (
        <HeaderContainer
          renderHeader={renderHeader}
          {...headerContainerProps}
          {...commonProps}
        />
      )}
    </div>
  );
}
