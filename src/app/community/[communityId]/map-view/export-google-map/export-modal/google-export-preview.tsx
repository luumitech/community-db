import { cn } from '@heroui/react';
import React from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { XlsxView } from '~/community/[communityId]/common/xlsx-view';

interface Props {
  className?: string;
  csv: string;
}

export const GoogleExportPreview: React.FC<Props> = ({ className, csv }) => {
  const [pending, startTransition] = React.useTransition();
  const [workbook, setWorkbook] = React.useState<XLSX.WorkBook>();

  React.useEffect(() => {
    startTransition(async () => {
      try {
        const wb = XLSX.read(csv, { type: 'string' });
        setWorkbook(wb);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    });
  }, [csv]);

  return (
    <XlsxView
      className={className}
      loading={pending}
      defaultColumns={3}
      hideSheetTabs
      workbook={workbook}
    />
  );
};
