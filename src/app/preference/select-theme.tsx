import { Radio, RadioGroup } from '@nextui-org/react';
import clsx from 'clsx';
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
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const onThemeSelect = React.useCallback(
    (selected: string) => {
      setTheme(selected);
    },
    [setTheme]
  );

  if (!mounted) return null;

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
