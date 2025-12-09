import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import {
  defaultRangeExtractor,
  Range,
  useVirtualizer,
} from '@tanstack/react-virtual';
import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Classes to be applied to sticky column Since we want to make first column
 * sticky to the left
 */
const pinningClass = 'sticky left-0 bg-background';

export interface XlsxSheetViewProps<TData> {
  className?: string;
  data: TData[];
  columns: ColumnDef<TData>[];
}

export function XlsxSheetView<T>({
  className,
  data,
  columns,
}: XlsxSheetViewProps<T>) {
  // The virtualizers need to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // debugTable: true,
  });

  const { rows } = table.getRowModel();
  const visibleColumns = table.getVisibleLeafColumns();

  /**
   * We are using a slightly different virtualization strategy for columns
   * (compared to virtual rows) in order to support dynamic row heights
   */
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
    rangeExtractor: React.useCallback((range: Range) => {
      const normalRange = defaultRangeExtractor(range);
      // Freeze first column (makes it always visible)
      const set = new Set([0, ...normalRange]);
      return [...set];
    }, []),
  });

  /**
   * Dynamic row height virtualization - alternatively you could use a simpler
   * fixed row height strategy without the need for `measureElement`
   */
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height
    measureElement: (element) => element?.getBoundingClientRect().height,
    overscan: 5,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();

  /**
   * Different virtualization strategy for columns - instead of absolute and
   * translateY, we add empty columns to the left and right
   */
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft =
      (virtualColumns[1]?.start ?? 0) - (virtualColumns[0]?.start ?? 0) >
      visibleColumns[0].getSize()
        ? (virtualColumns[1]?.start ?? 0)
        : 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return (
    <div
      ref={tableContainerRef}
      className={twMerge('relative grow overflow-auto', className)}
    >
      <table data-testid="export-xlsx">
        <thead className="sticky top-0 z-10 grid bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full">
              {virtualPaddingLeft ? (
                // Fake empty column to the left for virtualization scroll padding
                <th className="flex" style={{ width: virtualPaddingLeft }} />
              ) : null}
              {virtualColumns.map((vc) => {
                const header = headerGroup.headers[vc.index];
                return (
                  <th
                    key={header.id}
                    className={twMerge('flex', vc.index === 0 && pinningClass)}
                    style={{ width: header.getSize() }}
                  >
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </th>
                );
              })}
              {virtualPaddingRight ? (
                // Fake empty column to the right for virtualization scroll padding
                <th className="flex" style={{ width: virtualPaddingRight }} />
              ) : null}
            </tr>
          ))}
        </thead>
        <tbody
          className="relative flex"
          style={{
            // Tells scrollbar how big the table is
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<unknown>;
            const visibleCells = row.getVisibleCells();

            return (
              <tr
                data-index={virtualRow.index}
                ref={(node) => rowVirtualizer.measureElement(node)}
                key={row.id}
                className="absolute flex w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {virtualPaddingLeft ? (
                  // Fake empty column to the left for virtualization scroll padding
                  <td className="flex" style={{ width: virtualPaddingLeft }} />
                ) : null}
                {virtualColumns.map((vc) => {
                  const cell = visibleCells[vc.index];
                  return (
                    <td
                      key={cell.id}
                      className={twMerge(
                        'truncate whitespace-break-spaces',
                        vc.index === 0 && pinningClass
                      )}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
                {virtualPaddingRight ? (
                  // Fake empty column to the right for virtualization scroll padding
                  <td className="flex" style={{ width: virtualPaddingRight }} />
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
