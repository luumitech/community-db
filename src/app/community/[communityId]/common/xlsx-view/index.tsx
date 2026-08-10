import { Skeleton, cn } from '@heroui/react';
import React from 'react';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { useMakeXlsxData } from '../make-xlsx-data';
import { TabSelect } from './tab-select';
import { XlsxSheetView } from './xlsx-sheet-view';

interface Props {
  className?: string;
  workbook?: XLSX.WorkBook;
  /** Show loading state */
  loading?: boolean;
  /** Default columns to render during loading screen (default to 4) */
  defaultColumns?: number;
  /** Hide tabs (disable navigation of different sheets) */
  hideSheetTabs?: boolean;
}

export const XlsxView: React.FC<Props> = ({
  className,
  workbook,
  loading,
  hideSheetTabs,
  defaultColumns = 4,
}) => {
  const [pending, startTransition] = React.useTransition();
  const [sheetName, setSheetName] = React.useState<string>();
  const { data, columns, updateWorksheet } = useMakeXlsxData();

  React.useEffect(() => {
    if (workbook) {
      if (!sheetName) {
        setSheetName(workbook.SheetNames[0]);
      } else {
        startTransition(async () => {
          const worksheet = new WorksheetHelper(workbook, sheetName);
          updateWorksheet(worksheet);
        });
      }
    }
  }, [workbook, sheetName, updateWorksheet]);

  if (!!loading || pending || !data || !columns) {
    return (
      <div
        className={cn(className, 'grid gap-2')}
        style={{
          gridTemplateColumns: `repeat(${defaultColumns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: defaultColumns }).map((_, i) => (
          <Skeleton key={i} className="h-8 rounded-lg" />
        ))}
        {Array.from({ length: defaultColumns * 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <XlsxSheetView data={data} columns={columns} />
      {!hideSheetTabs && !!workbook && !!sheetName && (
        <TabSelect
          sheetNames={workbook.SheetNames}
          selectedSheetName={sheetName}
          onChange={setSheetName}
        />
      )}
    </>
  );
};
