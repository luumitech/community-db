import { cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem } from '~/view/base/select';
import { SelectXlsxFile } from './select-xlsx-file';
import { StartImport } from './start-import';
import { useHookFormContext } from './use-hook-form';

interface ImportMethodSelectItem {
  label: string;
  value: GQL.ImportMethod;
}
const importMethodSelectionList: ImportMethodSelectItem[] = [
  { label: 'Excel', value: GQL.ImportMethod.Xlsx },
  {
    label: 'Randomly generate sample data',
    value: GQL.ImportMethod.Random,
  },
];

interface Props {
  className?: string;
}

export const ImportForm: React.FC<Props> = ({ className }) => {
  const formMethods = useHookFormContext();
  const { watch, trigger } = formMethods;
  const importMethod = watch('method');

  return (
    <div className={cn(className, 'flex flex-col h-full gap-2')}>
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
      {importMethod === GQL.ImportMethod.Random && <StartImport />}
      {importMethod === GQL.ImportMethod.Xlsx && <SelectXlsxFile />}
    </div>
  );
};
