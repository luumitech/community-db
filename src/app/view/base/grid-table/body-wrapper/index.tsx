import React from 'react';
import type { ItemWithId } from '../_type';
import { VirtualWrap } from './virtual-wrap';

interface Props<ItemT extends ItemWithId> {
  /**
   * Enable tanstack virtualization to only render items that are visible in the
   * viewport
   */
  isVirtualized?: boolean;
  /**
   * Scroll element (i.e. parent element). Used for when `isVirtualized` is
   * enabled
   */
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  /**
   * Only used if `isVirtualized` is enabled. Provide height of each row
   * element, important for calculating how to set up the virtual scroll
   * container
   */
  rowHeight?: (elem: HTMLDivElement) => number;
  items: ItemT[];
  /** Renderer for each item */
  children: (item: ItemT) => React.ReactNode;
}

export function BodyWrapper<ItemT extends ItemWithId>(_props: Props<ItemT>) {
  const { isVirtualized, ...props } = _props;
  const { items, children } = props;

  if (items.length === 0) {
    return null;
  }

  if (!isVirtualized) {
    return items.map((item) => (
      <React.Fragment key={item.id}>{children(item)}</React.Fragment>
    ));
  }

  return <VirtualWrap {...props} />;
}
