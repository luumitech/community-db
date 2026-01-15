import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Loading } from '~/view/base/loading';
import type {
  CommonProps,
  HeaderRenderer,
  ItemRenderer,
  ItemWithId,
} from './_type';
import { Body } from './body';
import { Container } from './container';
import { EmptyContent } from './empty-content';
import { Header } from './header';

export interface GridTableProps<
  K extends readonly string[],
  ItemT extends ItemWithId,
> extends CommonProps<K> {
  renderHeader: HeaderRenderer<K[number]>;
  items: ItemT[];
  renderItem: ItemRenderer<K[number], ItemT>;
  /** Items are still loading */
  isLoading?: boolean;
  /** Render a custom component when the table is empty */
  emptyContent?: React.ReactNode;
  /** Render a custom component above the header */
  topContent?: React.ReactNode;
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
  const {
    renderHeader,
    items,
    renderItem,
    isLoading,
    emptyContent,
    topContent,
    ...commonProps
  } = props;

  return (
    <Container {...commonProps}>
      <div
        className={twMerge(
          'sticky top-header-height z-50 bg-background',
          'col-span-full grid grid-cols-subgrid'
        )}
      >
        {topContent && (
          <div className={twMerge('col-span-full mb-2')}>{topContent}</div>
        )}
        <Header {...commonProps} renderHeader={renderHeader} />
      </div>
      {items.map((item) => (
        <Body
          key={item.id}
          {...commonProps}
          item={item}
          renderItem={renderItem}
        />
      ))}
      {isLoading ? (
        <Loading className="col-span-full mb-2 flex justify-center" />
      ) : (
        items.length === 0 && <EmptyContent emptyContent={emptyContent} />
      )}
    </Container>
  );
}
