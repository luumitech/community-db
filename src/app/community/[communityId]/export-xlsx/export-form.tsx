import { Button, Skeleton, Spacer, cn } from '@heroui/react';
import React from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { useMakeXlsxData } from '~/community/[communityId]/common/make-xlsx-data';
import { XlsxView } from '~/community/[communityId]/common/xlsx-view';
import { startDownloadBlob } from '~/lib/dom';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { exportCommunityAsBase64 } from '~/server-action/export-community';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const ExportForm: React.FC<Props> = ({ className }) => {
  const formMethods = useHookFormContext();
  const [pending, startTransition] = React.useTransition();
  const { data, columns, updateWorksheet } = useMakeXlsxData();
  const [exportResult, setExportResult] =
    React.useState<Awaited<ReturnType<typeof exportCommunityAsBase64>>>();
  const { formState, watch } = formMethods;
  const communityId = watch('communityId');
  const { errors } = formState;

  React.useEffect(() => {
    startTransition(async () => {
      try {
        const result = await exportCommunityAsBase64(communityId);
        setExportResult(result);
        const buffer = Buffer.from(result.base64, 'base64');
        const workbook = XLSX.read(buffer);
        const worksheet = WorksheetHelper.fromFirstSheet(workbook);
        updateWorksheet(worksheet);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    });
  }, [communityId, updateWorksheet]);

  const onDownload = React.useCallback(() => {
    if (exportResult) {
      const buffer = Buffer.from(exportResult.base64, 'base64');
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      });
      startDownloadBlob(blob, exportResult.fn);
    }
  }, [exportResult]);

  const previewActive = !!data && !!columns;

  return (
    <div className={cn(className, 'flex flex-col h-full')}>
      <div className="flex items-center">
        <Button
          onPress={onDownload}
          endContent={<Icon icon="download" />}
          color="primary"
          isDisabled={!previewActive}
        >
          Download {exportResult?.fn}
        </Button>
      </div>
      <Spacer y={2} />
      {pending ? (
        <div className="flex flex-col grow mb-4 gap-3">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="grow rounded-lg" />
        </div>
      ) : (
        previewActive && <XlsxView data={data} columns={columns} />
      )}
    </div>
  );
};
