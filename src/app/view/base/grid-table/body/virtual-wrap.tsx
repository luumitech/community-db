import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from '../_config';
import type { CommonProps, ItemWithId, VirtualConfig } from '../_type';

type CustomVirtualConfig = Omit<VirtualConfig, 'isVirtualized'>;

interface Props<ColumnKey extends Readonly<string>, ItemT extends ItemWithId>
  extends CommonProps<ColumnKey>, CustomVirtualConfig {
  /**
   * Scroll element (i.e. parent element). Used for when `isVirtualized` is
   * enabled
   */
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  items: ItemT[];
  /** Body container renderer (i.e. rendering a row) */
  children: (item: ItemT) => React.ReactNode;
}

export function VirtualWrap<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
>(props: Props<ColumnKey, ItemT>) {
  const { scrollRef, items, children, ...virtualizerConfig } = props;
  const { gap = 8, estimateSize, measureElement } = virtualizerConfig;

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef?.current ?? null,
    getItemKey: (index) => items[index].id,
    gap,
    estimateSize,
    measureElement,
    overscan: 5,
    // Enable debugging
    // debug: true,
  });

  React.useEffect(() => {
    /**
     * This will make sure the list gets re-rendered properly when components
     * remounts
     */
    rowVirtualizer.measure();
  }, [rowVirtualizer]);

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      className={twMerge(CLASS_DEFAULT.inheritContainer)}
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
            className={twMerge(
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
