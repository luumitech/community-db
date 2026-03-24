import { GridStack as GS, type GridStackWidget } from 'gridstack';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';

export function useLocalStorageLayout(id: string) {
  const [value, setValue] = useLocalStorage<Record<string, GridStackWidget[]>>(
    `${lsFlags.gridLayout}-${id}`,
    {}
  );

  /**
   * Save current layout to localstorage
   *
   * - To current breakpoint layout
   */
  const saveLayout = React.useCallback(
    (grid: GS) => {
      const cols = grid.getColumn();
      const layout = grid.save(false);
      setValue({
        ...value,
        [cols]: layout,
      });
    },
    [value, setValue]
  );

  /**
   * Get layout from localstorage
   *
   * @param cols Number of columns in grid
   */
  const getLayout = React.useCallback(
    (cols: number) => {
      return value?.[cols];
    },
    [value]
  );

  /**
   * Reset layout by clearing the localstorage
   *
   * @param cols Number of columns in grid
   */
  const resetLayout = React.useCallback(
    (cols: number) => {
      if (value) {
        const { [cols]: _, ...layout } = value;
        setValue(layout);
      }
    },
    [value, setValue]
  );

  return { saveLayout, getLayout, resetLayout };
}
