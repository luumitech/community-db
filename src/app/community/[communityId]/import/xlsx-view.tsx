import {
  Column,
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

interface Props {
  data: unknown[];
  columns: ColumnDef<unknown>[];
}

export const XlsxView: React.FC<Props> = ({ data, columns }) => {
  // The virtualizers need to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
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
  });

  /**
   * Dynamic row height virtualization - alternatively you could use a simpler fixed
   * row height strategy without the need for `measureElement`
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
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return (
    <div ref={tableContainerRef} className={'h-full overflow-auto relative'}>
      <table>
        <thead className="grid sticky top-0 bg-background z-10">
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
                    className="flex"
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
          className="flex relative"
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
                className="flex absolute w-full"
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
                      className="truncate whitespace-break-spaces"
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
};
