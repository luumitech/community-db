import React from 'react';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { useMakeXlsxData } from '../view/make-xlsx-data';
import { XlsxView } from '../view/xlsx-view';

interface Props {
  className?: string;
  xlsxBase64: string;
}

export const XlsxViewWrapper: React.FC<Props> = ({ className, xlsxBase64 }) => {
  const { data, columns, updateWorksheet } = useMakeXlsxData();

  React.useEffect(() => {
    const buffer = Buffer.from(xlsxBase64, 'base64');
    const workbook = XLSX.read(buffer);
    const worksheet = WorksheetHelper.fromFirstSheet(workbook);
    updateWorksheet(worksheet);
  }, [xlsxBase64, updateWorksheet]);

  return (
    <div
    // 64px is height of header bar
    // 0.5rem is the top padding within <main/>, see layout.tsx
    //   className={`flex flex-col h-[calc(100vh_-_64px_-_0.5rem)]`}
    >
      {data && columns && <XlsxView data={data} columns={columns} />}
    </div>
  );
};
