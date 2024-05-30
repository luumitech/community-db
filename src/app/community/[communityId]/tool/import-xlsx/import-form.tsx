import { Skeleton, Spacer } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { Button } from '~/view/base/button';
import { FileInput } from '~/view/base/file-input';
import { useMakeXlsxData } from '../view/make-xlsx-data';
import { XlsxView } from '../view/xlsx-view';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const ImportForm: React.FC<Props> = ({ className }) => {
  const formMethods = useHookFormContext();
  const { formState, register } = formMethods;
  const [pending, startTransition] = React.useTransition();
  const { data, columns, updateWorksheet, clear } = useMakeXlsxData();
  const { errors } = formState;

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
    <div className={clsx(className, 'flex flex-col h-full')}>
      <input type="hidden" {...register('communityId')} />
      <div className="flex items-center">
        <FileInput
          label="Upload xlsx file"
          isRequired
          errorMessage={errors.xlsx?.message}
          isInvalid={errors.xlsx?.message != null}
          onClear={() => clear()}
          {...register('xlsx', {
            onChange: onXlsxSelect,
          })}
        />
        <Button
          className="ml-2"
          color="primary"
          type="submit"
          confirmation={true}
          confirmationArg={{
            bodyText: (
              <p>
                <div>Importing will wipe existing entries.</div>
                <div>Proceed?</div>
              </p>
            ),
          }}
          isDisabled={!previewActive}
        >
          Import
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
