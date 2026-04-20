import { useTheme } from 'next-themes';
import { darkTheme, lightTheme } from './theme';

export type EChartTheme = ReturnType<typeof useEChartTheme>;

/** Expose echart theme objects applicable to the current theme */
export function useEChartTheme() {
  const { resolvedTheme: theme } = useTheme();

  const themeObj = theme === 'light' ? lightTheme : darkTheme;
  return themeObj;
}
