import React from 'react';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { FileInput } from '~/view/base/file-input';
import { useMakeXlsxData } from '../common/make-xlsx-data';
import { XlsxView } from '../common/xlsx-view';
import { FirstTimeGuide } from './first-time-guide';
import { StartImport } from './start-import';
import { useHookFormContext } from './use-hook-form';

interface Props {}

export const SelectXlsxFile: React.FC<Props> = ({}) => {
  const formMethods = useHookFormContext();
  const { setValue, watch } = formMethods;
  const { data, columns, updateWorksheet, clear } = useMakeXlsxData();
  const importList = watch('hidden.importList');

  React.useEffect(() => {
    setValue('hidden.importList', [] as unknown as FileList);
  }, [setValue]);

  const onXlsxSelect = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const blob = evt.target.files?.[0];
    if (blob) {
      const buffer = await blob.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = WorksheetHelper.fromFirstSheet(workbook);
      updateWorksheet(worksheet);
    }
  };

  return (
    <>
      <FileInput
        className="max-w-sm"
        label="Upload xlsx file"
        isRequired
        controlName="hidden.importList"
        onChange={onXlsxSelect}
        onClear={() => clear()}
      />
      <StartImport />
      {importList.length === 0 && <FirstTimeGuide className="mt-6" />}
      {importList.length > 0 && <XlsxView data={data} columns={columns} />}
    </>
  );
};
