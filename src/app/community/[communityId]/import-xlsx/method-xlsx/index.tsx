import React from 'react';
import * as XLSX from 'xlsx';
import { XlsxView } from '~/community/[communityId]/common/xlsx-view';
import { FileInput } from '~/view/base/file-input';
import { toast } from '~/view/base/toastify';
import { StartImport } from '../start-import';
import { useHookFormContext } from '../use-hook-form';

interface Props {}

export const MethodXlsx: React.FC<Props> = ({}) => {
  const formMethods = useHookFormContext();
  const { setValue } = formMethods;
  const [workbook, setWorkbook] = React.useState<XLSX.WorkBook>();

  React.useEffect(() => {
    setValue('hidden.importList', []);
  }, [setValue]);

  const onXlsxSelect = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const blob = evt.target.files?.[0];
      if (blob) {
        const buffer = await blob.arrayBuffer();
        const wb = XLSX.read(buffer);
        setWorkbook(wb);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
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
        onClear={() => setWorkbook(undefined)}
      />
      <StartImport />
      {!!workbook && <XlsxView workbook={workbook} />}
    </>
  );
};
