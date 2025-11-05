import { cn } from '@heroui/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { supportedTheme } from '~/@modal/(.)preference/select-theme';

interface Props {
  className?: string;
}

export const ThemeSelect: React.FC<Props> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const onThemeSelect = React.useCallback<
    React.ReactEventHandler<HTMLSelectElement>
  >(
    (evt) => {
      const selected = evt.currentTarget.value;
      setTheme(selected);
    },
    [setTheme]
  );

  return (
    <select
      className={cn(
        'z-10 w-16 rounded-md p-0.5 outline-none text-tiny',
        'group-data-[hover=true]:border-default-500',
        'border-small border-default-300 dark:border-default-200',
        'bg-transparent text-default-500'
      )}
      id="theme"
      name="theme"
      value={theme}
      onChange={onThemeSelect}
    >
      {supportedTheme.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};
