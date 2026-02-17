import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { Loading } from '~/view/base/loading';
import {
  BODY_PROPS,
  CLASS_DEFAULT,
  COMMON_PROPS,
  HEADER_PROPS,
} from './_config';
import type { CommonProps, ItemWithId } from './_type';
import { Body, type BodyProps } from './body';
import { Container } from './container';
import { EmptyContent } from './empty-content';
import { Header, type HeaderProps } from './header';

export { CLASS_DEFAULT } from './_config';
export type { SortDescriptor } from './_type';

type DivProps = React.ComponentProps<'div'>;

export interface GridTableProps<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
>
  extends
    CommonProps<ColumnKey>,
    HeaderProps<ColumnKey>,
    BodyProps<ColumnKey, ItemT>,
    DivProps {
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
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
>(props: GridTableProps<ColumnKey, ItemT>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { isLoading, emptyContent, bottomContent, ...otherProps } = props;
  const headerProps = R.pick(props, HEADER_PROPS);
  const bodyProps = R.pick(props, BODY_PROPS);
  const commonProps = R.pick(props, COMMON_PROPS);
  const divProps = R.omit(otherProps, [
    ...HEADER_PROPS,
    ...BODY_PROPS,
    ...COMMON_PROPS,
  ]);
  const { items, virtualConfig } = bodyProps;

  return (
    <Container
      ref={scrollRef}
      className={cn(
        virtualConfig?.isVirtualized && CLASS_DEFAULT.virtualizedContainer
      )}
      {...commonProps}
      {...divProps}
    >
      <Header {...headerProps} {...commonProps} />
      {isLoading ? (
        <div className="col-span-full">
          <Loading className="my-2 flex justify-center" />
        </div>
      ) : items.length === 0 ? (
        <EmptyContent emptyContent={emptyContent} />
      ) : (
        <Body scrollRef={scrollRef} {...bodyProps} {...commonProps} />
      )}
      {!!bottomContent && <div className="col-span-full">{bottomContent}</div>}
    </Container>
  );
}
