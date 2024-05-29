'use client';
import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { startDownloadUrl } from '~/lib/dom';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { exportCommunityAsBase64 } from '~/server-action/export-community';
import { useMakeXlsxData } from '../view/make-xlsx-data';
import { XlsxView } from '../view/xlsx-view';
import { InputData, useHookForm } from './use-hook-form';

interface Props {
  className?: string;
  communityId: string;
}

export const ExportForm: React.FC<Props> = ({ className, communityId }) => {
  const { formMethods } = useHookForm(communityId);
  const { control, handleSubmit } = formMethods;
  const [pending, startTransition] = React.useTransition();
  const { data, columns, updateWorksheet } = useMakeXlsxData();

  const onSubmit = React.useCallback(
    (form: InputData) => {
      startTransition(async () => {
        try {
          const base64 = await exportCommunityAsBase64(form);
          const buffer = Buffer.from(base64, 'base64');
          const workbook = XLSX.read(buffer);
          const worksheet = WorksheetHelper.fromFirstSheet(workbook);
          updateWorksheet(worksheet);
          // startDownloadUrl(url, 'db.xlsx');
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          }
        }
      });
    },
    [updateWorksheet]
  );

  return (
    <div className={clsx(className)}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button type="submit" isLoading={pending}>
            download
          </Button>
        </form>
      </FormProvider>
      {data && columns && <XlsxView data={data} columns={columns} />}
    </div>
  );
};
