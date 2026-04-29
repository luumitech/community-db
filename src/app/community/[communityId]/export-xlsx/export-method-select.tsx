import { cn } from '@heroui/react';
import React from 'react';
import { ExportMethod } from '~/server-action/export-community/_type';
import { PlainSelect, type SelectItem } from '~/view/base/select';

const exportMethodItems: SelectItem[] = [
  { textValue: 'Multiple Sheets', key: ExportMethod.Multisheet },
  { textValue: 'Single Sheet', key: ExportMethod.Singlesheet },
];

interface Props {
  className?: string;
  exportMethod: ExportMethod;
  onChange: (method: ExportMethod) => void;
}

export const ExportMethodSelect: React.FC<Props> = ({
  className,
  exportMethod,
  onChange,
}) => {
  const description = React.useMemo(() => {
    switch (exportMethod) {
      case ExportMethod.Singlesheet:
        return 'Export data on a single sheet, useful for reading/printing.  Not all information are exported in this mode.';
      case ExportMethod.Multisheet:
        return 'Export data on multiple sheets, useful for backup/restore';
      default:
        return 'Unsupported export method';
    }
  }, [exportMethod]);

  return (
    <PlainSelect
      className={cn(className, 'max-w-sm')}
      size="sm"
      label="Export Methods"
      description={description}
      items={exportMethodItems}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[exportMethod]}
      onSelectionChange={(keys) => {
        const [method] = keys;
        onChange(method as ExportMethod);
      }}
    />
  );
};
