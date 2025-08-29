import { Button, cn } from '@heroui/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
}

export const ThemeToggle: React.FC<Props> = ({ className }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === 'light' ? 'light' : 'dark';

  const onThemeToggle = React.useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }, [currentTheme, setTheme]);

  return (
    <Button
      className={className}
      variant="ghost"
      isIconOnly
      onPress={onThemeToggle}
    >
      <Icon size={20} icon={currentTheme === 'light' ? 'moon' : 'sun'} />
    </Button>
  );
};
