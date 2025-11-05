import { Button, Skeleton, Spacer, cn } from '@heroui/react';
import React from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { XlsxView } from '~/community/[communityId]/common/xlsx-view';
import { startDownloadBlob } from '~/lib/dom';
import { exportCommunityAsBase64 } from '~/server-action/export-community';
import { ExportMethod } from '~/server-action/export-community/_type';
import { Icon } from '~/view/base/icon';
import { ExportMethodSelect } from './export-method-select';

interface Props {
  className?: string;
  communityId: string;
}

export const ExportForm: React.FC<Props> = ({ className, communityId }) => {
  const [pending, startTransition] = React.useTransition();
  const [exportMethod, setExportMethod] = React.useState(
    ExportMethod.Multisheet
  );
  const [workbook, setWorkbook] = React.useState<XLSX.WorkBook>();
  const [exportResult, setExportResult] =
    React.useState<Awaited<ReturnType<typeof exportCommunityAsBase64>>>();

  React.useEffect(() => {
    startTransition(async () => {
      try {
        const result = await exportCommunityAsBase64(communityId, exportMethod);
        setExportResult(result);
        const buffer = Buffer.from(result.base64, 'base64');
        const wb = XLSX.read(buffer);
        setWorkbook(wb);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    });
  }, [communityId, exportMethod]);

  const onDownload = React.useCallback(() => {
    if (exportResult) {
      const buffer = Buffer.from(exportResult.base64, 'base64');
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      });
      startDownloadBlob(blob, exportResult.fn);
    }
  }, [exportResult]);

  return (
    <div className={cn(className)}>
      <ExportMethodSelect
        exportMethod={exportMethod}
        onChange={setExportMethod}
      />
      <Button
        className="flex-shrink-0 self-start"
        onPress={onDownload}
        endContent={<Icon icon="download" />}
        color="primary"
        isLoading={pending}
        isDisabled={!workbook}
      >
        Download {exportResult?.fn}
      </Button>
      {pending ? (
        <div className="mb-4 flex grow flex-col gap-3">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="grow rounded-lg" />
        </div>
      ) : (
        !!workbook && <XlsxView workbook={workbook} />
      )}
    </div>
  );
};
