'use client';
import { Button } from '@nextui-org/react';
import React from 'react';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface Props {}

export const ThemeSwitch: React.FC<Props> = ({}) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <div>The current theme is: {theme}</div>
      <Button onClick={() => setTheme('light')}>Light Mode</Button>
      <Button onClick={() => setTheme('dark')}>Dark Mode</Button>
      <Button onClick={() => setTheme('system')}>System Mode</Button>
    </div>
  );
};
