'use client';
import { useQuery } from '@apollo/client';
import { Button } from '@nextui-org/react';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { MdEmail } from 'react-icons/md';
import { PiFolderOpenDuotone } from 'react-icons/pi';
import { read, utils } from 'xlsx';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { FileInput } from '~/view/base/file-input';
import { MainMenu } from '~/view/main-menu';
import { InputData, useHookForm } from './use-hook-form';
import { XlsxView } from './xlsx-view';

type TData = Record<string, string>;

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function CommunityView({ params }: RouteArgs) {
  const { communityId } = params;
  const [columns, _setColumns] = React.useState<ColumnDef<TData>[]>();
  const [data, _setData] = React.useState<TData[]>();
  const { handleSubmit, formState, register } = useHookForm();
  const { errors } = formState;

  const makeColumns = (worksheet: WorksheetHelper) => {
    const colCount = worksheet.colCount;
    return [...Array(colCount)].map((_, colIdx) => {
      return {
        accessorKey: colIdx.toString(),
        header: utils.encode_col(colIdx),
        ...(colIdx === 0 && {
          className: 'sticky',
          headerClassName: 'sticky',
        }),
      };
    });
  };

  const makeData = (worksheet: WorksheetHelper) => {
    const rowCount = worksheet.rowCount;
    const colList = makeColumns(worksheet);
    return [...Array(rowCount)].map((_, rowIdx) => ({
      ...Object.fromEntries(
        colList.map((col, colIdx) => [
          col.accessorKey,
          worksheet.cell(colIdx, rowIdx).w ?? '',
        ])
      ),
    }));
  };

  const onXlsxSelect = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const blob = evt.target.files?.[0];
    if (blob) {
      const buffer = await blob.arrayBuffer();
      const workbook = read(buffer);
      const worksheet = WorksheetHelper.fromFirstSheet(workbook);
      _setColumns(makeColumns(worksheet));
      _setData(makeData(worksheet));
    }
  };

  const uploadXlsx = async (form: InputData) => {
    const blob = form.xlsx[0];
    // const buffer = await blob.arrayBuffer();
    // const workbook = read(buffer);
    // const worksheet = WorksheetHelper.fromFirstSheet(workbook);
    // _setColumns(makeColumns(worksheet));
    // _setData(makeData(worksheet));
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
          onClear={() => _setData(undefined)}
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
