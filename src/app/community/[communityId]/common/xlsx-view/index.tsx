import { Skeleton, cn } from '@heroui/react';
import React from 'react';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { useMakeXlsxData } from '../make-xlsx-data';
import { TabSelect } from './tab-select';
import { XlsxSheetView } from './xlsx-sheet-view';

interface Props {
  className?: string;
  workbook: XLSX.WorkBook;
}

export const XlsxView: React.FC<Props> = ({ className, workbook }) => {
  const [pending, startTransition] = React.useTransition();
  const [sheetName, setSheetName] = React.useState<string>(
    workbook.SheetNames[0]
  );
  const { data, columns, updateWorksheet } = useMakeXlsxData();

  React.useEffect(() => {
    startTransition(async () => {
      const worksheet = new WorksheetHelper(workbook, sheetName);
      updateWorksheet(worksheet);
    });
  }, [workbook, sheetName, updateWorksheet]);

  if (pending || !data || !columns) {
    return (
      <div className={cn(className, 'grid grid-cols-4 gap-2')}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 rounded-lg" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-6 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <XlsxSheetView data={data} columns={columns} />
      <TabSelect
        sheetNames={workbook.SheetNames}
        selectedSheetName={sheetName}
        onChange={setSheetName}
      />
    </>
  );
};
