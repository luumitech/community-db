import { type CardProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { BODY_PROPS, COMMON_PROPS } from '../_config';
import type {
  CommonProps,
  ItemRenderer,
  ItemWithId,
  VirtualConfig,
} from '../_type';
import { BodyContainer } from './body-container';
import { VirtualWrap } from './virtual-wrap';

/**
 * List of props for body
 *
 * - NOTE: Update BODY_PROPS in '_type.ts' if adding or removing properties here
 */
export interface BodyProps<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
> {
  /**
   * Tanstack virtualization configuration
   *
   * - NOTE: this requires the parent to have a defined height
   */
  virtualConfig?: VirtualConfig;
  items: ItemT[];
  /** Pass additional props to Card component for each item */
  itemCardProps?: (item: ItemT) => CardProps | null | undefined;
  /** Render an item given a column and a row item */
  renderItem: ItemRenderer<ColumnKey, ItemT>;
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
  const _bodyProps = R.pick(props, BODY_PROPS);
  const commonProps = R.pick(props, COMMON_PROPS);
  const { virtualConfig, items, itemCardProps, renderItem } = _bodyProps;

  if (items.length === 0) {
    return null;
  }

  if (!virtualConfig?.isVirtualized) {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <BodyContainer
          item={item}
          renderItem={renderItem}
          {...itemCardProps?.(item)}
          {...commonProps}
        />
      </React.Fragment>
    ));
  }

  const { isVirtualized, ...configProps } = virtualConfig;
  return <VirtualWrap {...configProps} {...commonProps} {..._bodyProps} />;
}
