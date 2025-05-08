import { cn } from '@heroui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

export interface TableViewProps<TData> {
  className?: string;
  data: TData[];
  columns: ColumnDef<TData>[];
}

export function TableView<T>({ className, data, columns }: TableViewProps<T>) {
  // The virtualizers need to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    // debugTable: true,
  });

  const { rows } = table.getRowModel();

  /**
   * Dynamic row height virtualization - alternatively you could use a simpler
   * fixed row height strategy without the need for `measureElement`
   */
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 26, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height
    measureElement: (element) => element?.getBoundingClientRect().height,
    overscan: 5,
  });

  return (
    <div
      ref={tableContainerRef}
      className={cn(className, 'flex-grow overflow-auto relative')}
    >
      <table className="grid">
        <thead className="grid sticky top-0 bg-background z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={cn('flex', 'border-r-2')}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex-grow text-left">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          'select-none touch-none cursor-col-resize',
                          'w-1 bg-foreground-200',
                          header.column.getIsResizing()
                            ? 'bg-foreground-600'
                            : 'hover:bg-foreground-400'
                        )}
                      ></div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody
          className="grid relative"
          style={{
            // Tells scrollbar how big the table is
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<unknown>;
            return (
              <tr
                data-index={virtualRow.index}
                ref={(node) => rowVirtualizer.measureElement(node)}
                key={row.id}
                className="flex absolute w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className={cn('truncate', 'border-r-2')}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
