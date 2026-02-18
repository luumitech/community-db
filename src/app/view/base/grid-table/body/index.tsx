import { type CardProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { BODY_PROPS, COMMON_PROPS } from '../_config';
import type { CommonProps, ItemWithId, VirtualConfig } from '../_type';
import {
  BODY_CONTAINER_PROPS,
  BodyContainer,
  type BodyContainerProps,
} from './body-container';
import { VirtualWrap } from './virtual-wrap';

/**
 * List of props for body
 *
 * - NOTE: Update BODY_PROPS in '_type.ts' if adding or removing properties here
 */
export interface BodyProps<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
> extends BodyContainerProps<ColumnKey, ItemT> {
  /**
   * Tanstack virtualization configuration
   *
   * - NOTE: this requires the parent to have a defined height
   */
  virtualConfig?: VirtualConfig;
  items: ItemT[];
  /** Pass additional props to Card component for each item */
  itemCardProps?: (item: ItemT) => CardProps | null | undefined;
}

interface Props<ColumnKey extends Readonly<string>, ItemT extends ItemWithId>
  extends CommonProps<ColumnKey>, BodyProps<ColumnKey, ItemT> {
  /**
   * Scroll element (i.e. parent element). Used for when `isVirtualized` is
   * enabled
   */
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function Body<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
>(props: Props<ColumnKey, ItemT>) {
  const bodyProps = R.pick(props, BODY_PROPS);
  const bodyContainerProps = R.pick(props, BODY_CONTAINER_PROPS);
  const commonProps = R.pick(props, COMMON_PROPS);
  const { virtualConfig, items, itemCardProps, renderItem } = bodyProps;

  if (items.length === 0) {
    return null;
  }

  if (!virtualConfig?.isVirtualized) {
    return items.map((item) => (
      <BodyContainer
        key={item.id}
        item={item}
        {...bodyContainerProps}
        {...itemCardProps?.(item)}
        {...commonProps}
      />
    ));
  }

  const { isVirtualized, ...configProps } = virtualConfig;
  return (
    <VirtualWrap
      scrollRef={props.scrollRef}
      {...configProps}
      {...commonProps}
      items={items}
    >
      {(item) => (
        <BodyContainer
          item={item}
          {...bodyContainerProps}
          {...itemCardProps?.(item)}
          {...commonProps}
        />
      )}
    </VirtualWrap>
  );
}
