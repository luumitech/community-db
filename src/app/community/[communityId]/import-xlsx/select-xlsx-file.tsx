import { Skeleton } from '@nextui-org/react';
import React from 'react';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { FileInput } from '~/view/base/file-input';
import { useMakeXlsxData } from '../common/make-xlsx-data';
import { XlsxView } from '../common/xlsx-view';
import { useHookFormContext } from './use-hook-form';

interface Props {}

export const SelectXlsxFile: React.FC<Props> = ({}) => {
  const formMethods = useHookFormContext();
  const { setValue } = formMethods;
  const [pending, startTransition] = React.useTransition();
  const { data, columns, updateWorksheet, clear } = useMakeXlsxData();

  React.useEffect(() => {
    setValue('hidden.importList', [] as unknown as FileList);
  }, [setValue]);

  const onXlsxSelect = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(async () => {
      const blob = evt.target.files?.[0];
      if (blob) {
        const buffer = await blob.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const worksheet = WorksheetHelper.fromFirstSheet(workbook);
        updateWorksheet(worksheet);
      }
    });
  };

  const previewActive = !!data && !!columns;

  return (
    <>
      <FileInput
        label="Upload xlsx file"
        isRequired
        controlName="hidden.importList"
        onChange={onXlsxSelect}
        onClear={() => clear()}
      />
      {pending ? (
        <div className="flex flex-col grow mb-4 gap-3">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="grow rounded-lg" />
        </div>
      ) : (
        previewActive && <XlsxView data={data} columns={columns} />
      )}
    </>
  );
};
