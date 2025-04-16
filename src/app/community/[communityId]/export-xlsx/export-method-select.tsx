import { Select, SelectItem, cn } from '@heroui/react';
import React from 'react';
import { ExportMethod } from '~/server-action/export-community/_type';

const exportMethodItems = [
  { label: 'Multiple Sheets', value: ExportMethod.Multisheet },
  { label: 'Single Sheet', value: ExportMethod.Singlesheet },
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
        return 'Export data on a single sheet';
      case ExportMethod.Multisheet:
        return 'Export data on multiple sheets, useful for backup/restore';
      default:
        return 'Unsupported export method';
    }
  }, [exportMethod]);

  return (
    <Select
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
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
