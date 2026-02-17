import { cn, type CardProps } from '@heroui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from '../_config';
import type {
  CommonProps,
  ItemRenderer,
  ItemWithId,
  VirtualConfig,
} from '../_type';
import { BodyContainer } from './body-container';

type CustomVirtualConfig = Omit<VirtualConfig, 'isVirtualized'>;

interface Props<ColumnKey extends Readonly<string>, ItemT extends ItemWithId>
  extends CommonProps<ColumnKey>, CustomVirtualConfig {
  /**
   * Scroll element (i.e. parent element). Used for when `isVirtualized` is
   * enabled
   */
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  items: ItemT[];
  /** Pass additional props to Card component for each item */
  itemCardProps?: (item: ItemT) => CardProps | null | undefined;
  /** Render an item given a column and a row item */
  renderItem: ItemRenderer<ColumnKey, ItemT>;
}

export function VirtualWrap<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
>(props: Props<ColumnKey, ItemT>) {
  const commonProps = R.pick(props, COMMON_PROPS);
  const { scrollRef, items, itemCardProps, renderItem, ...virtualizerConfig } =
    props;
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
            <BodyContainer
              item={item}
              {...itemCardProps?.(item)}
              renderItem={renderItem}
              {...commonProps}
            />
          </div>
        );
      })}
    </div>
  );
}
