import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Button } from '~/view/base/button';
import { Select, SelectItem } from '~/view/base/select';
import { SelectXlsxFile } from './select-xlsx-file';
import { useHookFormContext } from './use-hook-form';

interface ImportMethodSelectItem {
  label: string;
  value: GQL.ImportMethod;
}
const importMethodSelectionList: ImportMethodSelectItem[] = [
  {
    label: 'Randomly generate sample data',
    value: GQL.ImportMethod.Random,
  },
  { label: 'Excel', value: GQL.ImportMethod.Xlsx },
];

interface Props {
  className?: string;
}

export const ImportForm: React.FC<Props> = ({ className }) => {
  const formMethods = useHookFormContext();
  const { watch, trigger } = formMethods;
  const importMethod = watch('method');

  return (
    <div className={clsx(className, 'flex flex-col h-full gap-2')}>
      <div className="flex items-center gap-2">
        <Select
          className="max-w-sm"
          controlName="method"
          label="Import Method"
          items={importMethodSelectionList}
          placeholder="Select an import method"
          disallowEmptySelection
        >
          {(item) => (
            <SelectItem key={item.value} textValue={item.label}>
              {item.label}
            </SelectItem>
          )}
        </Select>
        <Button
          className="h-full"
          color="primary"
          type="submit"
          confirmation={true}
          beforeConfirm={async () => {
            const validated = await trigger();
            return validated;
          }}
          confirmationArg={{
            bodyText: (
              <p>
                Importing will wipe existing entries in current database.
                <br />
                Proceed?
              </p>
            ),
          }}
        >
          Import
        </Button>
      </div>
      {importMethod === GQL.ImportMethod.Xlsx && <SelectXlsxFile />}
    </div>
  );
};
