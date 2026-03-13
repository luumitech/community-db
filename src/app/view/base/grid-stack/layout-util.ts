import { GridStack, type GridStackOptions } from 'gridstack';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';

type GridLayout = GridStackOptions['children'];
type BreakpointLayouts = Record<number, GridLayout>;

export function useLayoutUtil(id: string) {
  const [savedLayout, setSavedLayout] = useLocalStorage<BreakpointLayouts>(
    `${lsFlags.gridLayout}-${id}`,
    {}
  );

  const saveLayout = React.useCallback(
    (grid: GridStack) => {
      const cols = grid.getColumn();
      setSavedLayout({
        ...savedLayout,
        [cols]: grid.save(false) as GridLayout,
      });
    },
    [savedLayout, setSavedLayout]
  );

  const restoreLayout = React.useCallback(
    (grid: GridStack): GridLayout | null => {
      const cols = grid.getColumn();
      return savedLayout?.[cols] ?? null;
    },
    [savedLayout]
  );

  return { saveLayout, restoreLayout };
}
