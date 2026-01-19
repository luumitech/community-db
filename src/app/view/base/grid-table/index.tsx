import { cn, type CardProps } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Loading } from '~/view/base/loading';
import { CLASS_DEFAULT } from './_config';
import type {
  CommonProps,
  HeaderRenderer,
  ItemRenderer,
  ItemWithId,
} from './_type';
import { Body } from './body';
import { BodyWrapper } from './body-wrapper';
import { Container } from './container';
import { EmptyContent } from './empty-content';
import { Header } from './header';

export { CLASS_DEFAULT } from './_config';

export interface GridTableProps<
  K extends readonly string[],
  ItemT extends ItemWithId,
> extends CommonProps<K> {
  /**
   * Should header be sticky?,
   *
   * - When sticky, you can customize the sticky CSS using config.headerSticky
   */
  isHeaderSticky?: boolean;
  /**
   * Enable tanstack virtualization to only render items that are visible in the
   * viewport
   */
  isVirtualized?: boolean;
  /**
   * Only used if `isVirtualized` is enabled. Provide height of each row
   * element, important for calculating how to set up the virtual scroll
   * container
   */
  rowHeight?: (elem: HTMLDivElement) => number;
  renderHeader?: HeaderRenderer<K[number]>;
  items: ItemT[];
  renderItem: ItemRenderer<K[number], ItemT>;
  /** Pass additional props to Card component for each item */
  itemCardProps?: (item: ItemT) => CardProps;
  /** Items are still loading */
  isLoading?: boolean;
  /** Render a custom component when the table is empty */
  emptyContent?: React.ReactNode;
  /** Render a custom component above the header */
  topContent?: React.ReactNode;
  /** Render a custom component after last row of table */
  bottomContent?: React.ReactNode;
}

/**
 * Renders a responsive table (base on CSS grid)
 *
 * - The header always sticks to top of screen (just below app header)
 */
export function GridTable<
  K extends readonly string[],
  ItemT extends ItemWithId,
>(props: GridTableProps<K, ItemT>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const {
    isHeaderSticky,
    isVirtualized,
    rowHeight,
    renderHeader,
    items,
    renderItem,
    itemCardProps,
    isLoading,
    emptyContent,
    topContent,
    bottomContent,
    ...commonProps
  } = props;

  return (
    <Container
      ref={scrollRef}
      className={cn(isVirtualized && CLASS_DEFAULT.virtualizedContainer)}
      {...commonProps}
    >
      {!!renderHeader && (
        <div
          className={twMerge(
            CLASS_DEFAULT.inheritContainer,
            isHeaderSticky &&
              (commonProps.config?.headerSticky ?? CLASS_DEFAULT.headerSticky)
          )}
        >
          {!!topContent && (
            <div className={cn('col-span-full mb-2')}>{topContent}</div>
          )}
          <Header {...commonProps} renderHeader={renderHeader} />
        </div>
      )}
      {isLoading ? (
        <div className="col-span-full">
          <Loading className="my-2 flex justify-center" />
        </div>
      ) : items.length === 0 ? (
        <EmptyContent emptyContent={emptyContent} />
      ) : (
        <BodyWrapper
          isVirtualized={isVirtualized}
          rowHeight={rowHeight}
          scrollRef={scrollRef}
          items={items}
        >
          {(item) => (
            <Body
              {...commonProps}
              item={item}
              renderItem={renderItem}
              {...itemCardProps?.(item)}
            />
          )}
        </BodyWrapper>
      )}
      {!!bottomContent && <div className="col-span-full">{bottomContent}</div>}
    </Container>
  );
}
