import React from 'react';
import type { ItemWithId, VirtualConfig } from '../_type';
import { VirtualWrap } from './virtual-wrap';

/**
 * List of props for body
 *
 * - NOTE: Update BODY_PROPS in '_type.ts' if adding or removing properties here
 */
export interface BodyWrapperProps<ItemT extends ItemWithId> {
  /**
   * Tanstack virtualization configuration
   *
   * - NOTE: this requires the parent to have a defined height
   */
  virtualConfig?: VirtualConfig;
  items: ItemT[];
}

interface Props<ItemT extends ItemWithId> extends BodyWrapperProps<ItemT> {
  /**
   * Scroll element (i.e. parent element). Used for when `isVirtualized` is
   * enabled
   */
  scrollRef: React.RefObject<HTMLDivElement | null>;
  /** Renderer for each item */
  children: (item: ItemT) => React.ReactNode;
}

export function BodyWrapper<ItemT extends ItemWithId>(props: Props<ItemT>) {
  const { virtualConfig, ...otherProps } = props;
  const { items, children } = otherProps;

  if (items.length === 0) {
    return null;
  }

  if (!virtualConfig?.isVirtualized) {
    return items.map((item) => (
      <React.Fragment key={item.id}>{children(item)}</React.Fragment>
    ));
  }

  const { isVirtualized, ...configProps } = virtualConfig;
  return <VirtualWrap {...configProps} {...otherProps} />;
}
