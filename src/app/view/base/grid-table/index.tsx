import { cn, type CardProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { Loading } from '~/view/base/loading';
import {
  BODY_PROPS,
  CLASS_DEFAULT,
  COMMON_PROPS,
  HEADER_PROPS,
} from './_config';
import type { CommonProps, ItemRenderer, ItemWithId } from './_type';
import { Body } from './body';
import { BodyWrapper, type BodyWrapperProps } from './body-wrapper';
import { Container } from './container';
import { EmptyContent } from './empty-content';
import { HeaderWrapper, type HeaderWrapperProps } from './header-wrapper';

export { CLASS_DEFAULT } from './_config';
export type { SortDescriptor } from './_type';

export interface GridTableProps<
  K extends readonly string[],
  ItemT extends ItemWithId,
>
  extends
    CommonProps<K>,
    HeaderWrapperProps<K[number]>,
    BodyWrapperProps<ItemT> {
  /** Render an item given a column and a row item */
  renderItem: ItemRenderer<K[number], ItemT>;
  /** Pass additional props to Card component for each item */
  itemCardProps?: (item: ItemT) => CardProps;
  /** Items are still loading */
  isLoading?: boolean;
  /** Render a custom component when the table is empty */
  emptyContent?: React.ReactNode;
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
    virtualConfig,
    itemCardProps,
    items,
    renderItem,
    isLoading,
    emptyContent,
    bottomContent,
  } = props;
  const headerProps = R.pick(props, HEADER_PROPS);
  const bodyProps = R.pick(props, BODY_PROPS);
  const commonProps = R.pick(props, COMMON_PROPS);

  return (
    <Container
      ref={scrollRef}
      className={cn(
        virtualConfig?.isVirtualized && CLASS_DEFAULT.virtualizedContainer
      )}
      {...commonProps}
    >
      <HeaderWrapper {...headerProps} {...commonProps} />
      {isLoading ? (
        <div className="col-span-full">
          <Loading className="my-2 flex justify-center" />
        </div>
      ) : items.length === 0 ? (
        <EmptyContent emptyContent={emptyContent} />
      ) : (
        <BodyWrapper scrollRef={scrollRef} {...bodyProps} {...commonProps}>
          {(item) => (
            <Body
              item={item}
              {...itemCardProps?.(item)}
              renderItem={renderItem}
              {...commonProps}
            />
          )}
        </BodyWrapper>
      )}
      {!!bottomContent && <div className="col-span-full">{bottomContent}</div>}
    </Container>
  );
}
