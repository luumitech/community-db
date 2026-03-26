import {
  GridStack as GS,
  type GridStackNode,
  type GridStackWidget,
} from 'gridstack';
import React from 'react';
import { useLatest, useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';
import { type Widget } from '~/view/base/grid-stack';

/**
 * Type of the widget stored into local storage
 *
 * - Basically, it is Widget that requires the field 'id'
 */
type LayoutWidget<WidgetId extends string> = Required<
  Pick<Widget<WidgetId>, 'id'>
> &
  Partial<Omit<Widget<WidgetId>, 'id'>>;

/**
 * Type used to define list of widgets stored in localstorage
 *
 * - Indexed by widgetId, so any widgets can be easily managed
 */
type LayoutWidgetMap<WidgetId extends string> = Partial<
  Record<WidgetId, LayoutWidget<WidgetId>>
>;

/**
 * Convert the widget layout information (array format as stored in
 * localstorage) to map format (indexed by widgetID)
 *
 * @param layout Layout in array format
 * @returns Layout in map format (indexed by widgetID)
 */
function layoutArrayToMap<WidgetId extends string>(
  layout?: GridStackWidget[]
): LayoutWidgetMap<WidgetId> {
  const result: LayoutWidgetMap<WidgetId> = {};
  const widgetList = (layout ?? []) as LayoutWidget<WidgetId>[];
  widgetList.map((widget) => {
    result[widget.id] = widget;
  });
  return result;
}

interface LSFormat<WidgetId extends string> {
  idList?: WidgetId[];
  [cols: number]: GridStackWidget[] | undefined;
}

/**
 * Manage layout values stored in localstorage
 *
 * The object in localstorage is organized as:
 *
 * ```js
 * {
 *   // Visible widget IDs currently displayed
 *   idList: ['id1', 'id2' ],
 *   // 'cols' can is a number between 1-12, relates to the current
 *   // number of columns in the grid for the current breakpoint
 *   [cols]: [
 *     // widget configuration stored in GridStack
 *     { id: 'widgetId', x: 10, y: 20 },
 *     ...
 *   ]
 * }
 * ```
 *
 * @param suffix Suffix attached to localstorage key to store grid layout
 *   information
 * @param cols Number of columns in current grid layout
 * @returns
 */
export function useLocalStorageLayout<WidgetId extends string>(suffix: string) {
  const [_value, setValue] = useLocalStorage<LSFormat<WidgetId>>(
    `${lsFlags.gridLayout}-${suffix}`,
    {}
  );
  /**
   * This avoids stale closure and guarantees that all methods within this hook
   * can access the latest value in localstorage
   */
  const lsValue = useLatest(_value);

  /** Save List of visible widget IDs to localstorage */
  const saveLayoutIds = React.useCallback(
    (idList: WidgetId[]) => {
      setValue({ ...lsValue.current, idList });
    },
    [lsValue, setValue]
  );

  /**
   * Get layout in localstorage and present it as a map indexed by widget ID
   *
   * @param grid GridStack instance
   */
  const getLayout = React.useCallback(
    (grid: GS) => {
      const cols = grid.getColumn();
      return layoutArrayToMap<WidgetId>(lsValue.current?.[cols]);
    },
    [lsValue]
  );

  /**
   * Update layout details in localstorage to reflect the current grid
   * configuration
   *
   * @param grid GridStack instance
   * @param items List of widgets layouts to update
   */
  const updateLayout = React.useCallback(
    (grid: GS, items: GridStackNode[] | GridStackWidget[]) => {
      const cols = grid.getColumn();
      const prevLayoutMap = layoutArrayToMap<WidgetId>(lsValue.current?.[cols]);
      items.forEach((item) => {
        /**
         * Only keep the serializable fields that are important for layout
         * purpose
         */
        const { id, x, y, w, h } = item;
        const itemLayout = { id, x, y, w, h } as LayoutWidget<WidgetId>;
        const itemId = id as WidgetId;
        prevLayoutMap[itemId] = itemLayout;
      });

      setValue({
        ...lsValue.current,
        [cols]: Object.values(prevLayoutMap),
      });
    },
    [lsValue, setValue]
  );

  /**
   * Reset layout by clearing the localstorage
   *
   * @param grid GridStack instance
   */
  const resetLayout = React.useCallback(
    (grid: GS) => {
      const cols = grid.getColumn();
      if (lsValue.current) {
        const { [cols]: _, ...layout } = lsValue.current;
        setValue(layout);
      }
    },
    [lsValue, setValue]
  );

  /** Reset all layouts by clearing the localstorage */
  const resetAllLayout = React.useCallback(() => {
    setValue({});
  }, [setValue]);

  return {
    layoutIdList: lsValue.current?.idList,
    saveLayoutIds,
    getLayout,
    updateLayout,
    resetLayout,
    resetAllLayout,
  };
}
