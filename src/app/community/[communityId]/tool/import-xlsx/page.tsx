'use client';
import { useQuery } from '@apollo/client';
import { Button } from '@nextui-org/react';
import React from 'react';
import * as XLSX from 'xlsx';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { FileInput } from '~/view/base/file-input';
import { useMakeXlsxData } from '../view/make-xlsx-data';
import { XlsxView } from '../view/xlsx-view';
import { InputData, useHookForm } from './use-hook-form';

type TData = Record<string, string>;

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function ImportXlsx({ params }: RouteArgs) {
  const { communityId } = params;
  const { data, columns, updateWorksheet, clear } = useMakeXlsxData();
  const { handleSubmit, formState, register } = useHookForm();
  const { errors } = formState;

  const onXlsxSelect = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const blob = evt.target.files?.[0];
    if (blob) {
      const buffer = await blob.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = WorksheetHelper.fromFirstSheet(workbook);
      updateWorksheet(worksheet);
    }
  };

  const uploadXlsx = async (form: InputData) => {
    const blob = form.xlsx[0];
  };

  return (
    <div
      // 64px is height of header bar
      // 0.5rem is the top padding within <main/>, see layout.tsx
      className={`flex flex-col h-[calc(100vh_-_64px_-_0.5rem)]`}
    >
      <form onSubmit={handleSubmit(uploadXlsx)}>
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
          className="my-2"
          color="primary"
          type="submit"
          isDisabled={!formState.isDirty}
          // isLoading={result.loading}
        >
          Import
        </Button>
      </form>
      {data && columns && <XlsxView data={data} columns={columns} />}
    </div>
  );
}
