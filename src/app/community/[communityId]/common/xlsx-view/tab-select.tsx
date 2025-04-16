import { Tab, Tabs, cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
  sheetNames: string[];
  selectedSheetName: string;
  onChange: (sheetName: string) => void;
}

export const TabSelect: React.FC<Props> = ({
  className,
  sheetNames,
  selectedSheetName,
  onChange,
}) => {
  const tabs = React.useMemo(() => {
    return sheetNames.map((name) => ({
      key: name,
      label: name,
    }));
  }, [sheetNames]);

  return (
    <div className={cn(className, 'border-t border-divider')}>
      <Tabs
        aria-label="sheet-tab"
        variant="underlined"
        items={tabs}
        selectedKey={selectedSheetName}
        onSelectionChange={(key) => {
          onChange(key as string);
        }}
      >
        {(item) => <Tab key={item.key} title={item.label} />}
      </Tabs>
    </div>
  );
};
