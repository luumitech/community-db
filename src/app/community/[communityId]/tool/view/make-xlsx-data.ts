import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';

type TData = Record<string, string>;

export function useMakeXlsxData() {
  const [columns, _setColumns] = React.useState<ColumnDef<TData>[]>();
  const [data, _setData] = React.useState<TData[]>();

  const makeColumns = React.useCallback((worksheet: WorksheetHelper) => {
    const colCount = worksheet.colCount;
    return [...Array(colCount)].map((_, colIdx) => {
      return {
        accessorKey: colIdx.toString(),
        header: XLSX.utils.encode_col(colIdx),
        ...(colIdx === 0 && {
          className: 'sticky',
          headerClassName: 'sticky',
        }),
        // Make first row header
        columns: [
          {
            accessorKey: colIdx.toString(),
            header: worksheet.cell(colIdx, 0).w ?? '',
          },
        ],
      };
    });
  }, []);

  const makeData = React.useCallback(
    (worksheet: WorksheetHelper) => {
      const rowCount = worksheet.rowCount;
      const colList = makeColumns(worksheet);
      // First row is header row, so don't include in data
      return R.range(1, rowCount).map((rowIdx) => ({
        ...Object.fromEntries(
          colList.map((col, colIdx) => [
            col.accessorKey,
            worksheet.cell(colIdx, rowIdx).w ?? '',
          ])
        ),
      }));
    },
    [makeColumns]
  );

  /**
   * Clear all data, return empty columns/data
   */
  const clear = React.useCallback(() => {
    _setData(undefined);
  }, []);

  const updateWorksheet = (worksheet: WorksheetHelper) => {
    _setColumns(makeColumns(worksheet));
    _setData(makeData(worksheet));
  };

  return { updateWorksheet, clear, columns, data };
}
