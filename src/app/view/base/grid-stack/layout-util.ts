import { type GridStackOptions } from 'gridstack';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';
import { useGridStackContext } from './grid-stack-context';

type GridLayout = GridStackOptions['children'];
type BreakpointLayouts = Record<number, GridLayout>;

export function useLayoutUtil(id: string) {
  const { grid, widgets } = useGridStackContext();
  const [savedLayout, setSavedLayout] = useLocalStorage<BreakpointLayouts>(
    `${lsFlags.gridLayout}-${id}`,
    {}
  );

  /**
   * Save current layout to localstorage
   *
   * - Layouts are saved for each breakpoint layout
   */
  const saveLayout = React.useCallback(() => {
    if (!grid) {
      return;
    }
    const cols = grid.getColumn();
    setSavedLayout({
      ...savedLayout,
      [cols]: grid.save(false) as GridLayout,
    });
  }, [grid, savedLayout, setSavedLayout]);

  /**
   * Get layout from localstorage
   *
   * - Get layout per breakpoint layout
   */
  const getLayout = React.useCallback(() => {
    if (!grid) {
      return;
    }
    const cols = grid.getColumn();
    const layout = savedLayout?.[cols];
    return layout;
  }, [grid, savedLayout]);

  /**
   * Reset layout by clearing the localstorage
   *
   * - Clear per breakpoint layout
   */
  const resetLayout = React.useCallback(() => {
    if (!grid) {
      return null;
    }
    const cols = grid.getColumn();
    if (savedLayout) {
      const { [cols]: _, ...layout } = savedLayout;
      setSavedLayout(layout);
      grid.load(widgets);
    }
  }, [grid, widgets, savedLayout, setSavedLayout]);

  return { saveLayout, getLayout, resetLayout };
}
