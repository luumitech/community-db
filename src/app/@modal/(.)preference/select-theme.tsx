import { Radio, RadioGroup, cn } from '@heroui/react';
import { useTheme } from 'next-themes';
import React from 'react';

const supportedTheme = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

interface Props {
  className?: string;
}

export const SelectTheme: React.FC<Props> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const onThemeSelect = React.useCallback(
    (selected: string) => {
      setTheme(selected);
    },
    [setTheme]
  );

  return (
    <div className={className}>
      <RadioGroup
        aria-label="Select Theme"
        defaultValue={theme}
        onValueChange={onThemeSelect}
      >
        {supportedTheme.map(({ value, label }) => (
          <Radio key={value} value={value}>
            {label}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
};
