import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { type ContactInfo } from '../contact-util';

type TData = Record<string, string>;

export function useMakeTableData() {
  const [columns, _setColumns] = React.useState<ColumnDef<TData>[]>();
  const [data, _setData] = React.useState<TData[]>();

  const makeColumns = React.useCallback(() => {
    const columnName = ['Address', 'First Name', 'Last Name', 'Email'];
    const colCount = columnName.length;
    return [...Array(colCount)].map((_, colIdx) => {
      return {
        accessorKey: columnName[colIdx],
        header: columnName[colIdx],
        ...(colIdx === 0 && {
          className: 'sticky',
          headerClassName: 'sticky',
        }),
      };
    });
  }, []);

  const makeData = React.useCallback(
    (contactInfo: ContactInfo) => {
      const { contactList } = contactInfo;
      const colList = makeColumns();
      return contactList.map((contact) => {
        return {
          [colList[0].accessorKey]: contact.address ?? '',
          [colList[1].accessorKey]: contact.firstName ?? '',
          [colList[2].accessorKey]: contact.lastName ?? '',
          [colList[3].accessorKey]: contact.email ?? '',
        };
      });
    },
    [makeColumns]
  );

  /** Clear all data, return empty columns/data */
  const clear = React.useCallback(() => {
    _setData(undefined);
    _setColumns(undefined);
  }, []);

  const updateTable = React.useCallback(
    (contactInfo: ContactInfo) => {
      _setColumns(makeColumns());
      _setData(makeData(contactInfo));
    },
    [makeColumns, makeData]
  );

  return {
    updateTable,
    clear,
    columns,
    data,
    // Is data ready to be displayed?
    dataReady: !!data && !!columns,
  };
}
