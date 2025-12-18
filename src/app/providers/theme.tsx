import { ThemeProvider } from 'next-themes';
import React from 'react';

interface Props {}

export const ThemeProviders: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  /**
   * Light/dark theme can be customized
   *
   * See: https://nextui.org/docs/customization/customize-theme
   */
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      {children}
    </ThemeProvider>
  );
};
