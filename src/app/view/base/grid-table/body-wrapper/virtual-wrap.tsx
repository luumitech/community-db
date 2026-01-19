import { cn } from '@heroui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from '../_config';
import type { ItemWithId } from '../_type';

interface Props<ItemT extends ItemWithId> {
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
  children: (item: ItemT) => React.ReactNode;
}

export function VirtualWrap<ItemT extends ItemWithId>(_props: Props<ItemT>) {
  const { scrollRef, rowHeight, items, children } = _props;

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef?.current ?? null,
    getItemKey: (index) => items[index].id,
    estimateSize: () => 35,
    measureElement: rowHeight,
    overscan: 5,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      className={cn(CLASS_DEFAULT.inheritContainer)}
      style={{
        height: rowVirtualizer.getTotalSize(),
      }}
    >
      {virtualItems.map((row) => {
        const item = items[row.index];
        return (
          <div
            key={row.key}
            data-index={row.index}
            ref={rowVirtualizer.measureElement}
            className={cn(
              CLASS_DEFAULT.inheritContainer,
              // Force all rows to start at the same grid row, which
              // allowing translateY to perform spacing appropriately
              'row-span-full'
            )}
            style={{
              height: row.size,
              transform: `translateY(${row.start}px)`,
            }}
          >
            {children(item)}
          </div>
        );
      })}
    </div>
  );
}
