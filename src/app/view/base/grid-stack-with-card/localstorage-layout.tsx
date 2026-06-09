import { type GridStackNode, type GridStackWidget } from 'gridstack';
import React from 'react';
import { useLatest, useLocalStorage, useWindowSize } from 'react-use';
import { lsFlags } from '~/lib/env';
import { type Breakpoint, type Widget } from '~/view/base/grid-stack';

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
 * @param breakpointConfig Breakpoint configuration, for determining number of
 *   grid columns given current window width
 * @returns
 */
export function useLocalStorageLayout<WidgetId extends string>(
  suffix: string,
  breakpointConfig: Breakpoint[]
) {
  const [_value, setValue] = useLocalStorage<LSFormat<WidgetId>>(
    `${lsFlags.gridLayout}-${suffix}`,
    {}
  );
  /**
   * This avoids stale closure and guarantees that all methods within this hook
   * can access the latest value in localstorage
   */
  const lsRef = useLatest(_value);

  const windowSz = useWindowSize();
  const _cols = React.useMemo(() => {
    const idx = breakpointConfig.findIndex(
      (bp) => bp.w && windowSz.width >= bp.w
    );
    if (idx === -1) {
      return breakpointConfig[breakpointConfig.length - 1].c;
    } else if (idx === 0) {
      return 12;
    } else {
      return breakpointConfig[idx - 1].c;
    }
  }, [breakpointConfig, windowSz.width]);
  const colsRef = useLatest(_cols);

  /** Save List of visible widget IDs to localstorage */
  const saveLayoutIds = React.useCallback(
    (idList: WidgetId[]) => {
      setValue({ ...lsRef.current, idList });
    },
    [lsRef, setValue]
  );

  /** Get layout in localstorage and present it as a map indexed by widget ID */
  const getLayoutAsMap = React.useCallback(() => {
    const layoutArray = lsRef.current?.[colsRef.current];
    return layoutArrayToMap<WidgetId>(layoutArray);
  }, [colsRef, lsRef]);

  /**
   * Update layout details in localstorage to reflect the current grid
   * configuration
   *
   * @param items List of widgets layouts to update
   */
  const updateLayout = React.useCallback(
    (items: GridStackNode[] | GridStackWidget[]) => {
      const cols = colsRef.current;
      const layoutArray = lsRef.current?.[cols];
      const prevLayoutMap = layoutArrayToMap<WidgetId>(layoutArray);
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
        ...lsRef.current,
        [cols]: Object.values(prevLayoutMap),
      });
    },
    [colsRef, lsRef, setValue]
  );

  /** Reset layout by clearing the localstorage */
  const resetLayout = React.useCallback(() => {
    if (lsRef.current) {
      const cols = colsRef.current;
      const { [cols]: _, idList, ...layout } = lsRef.current;
      setValue(layout);
    }
  }, [colsRef, lsRef, setValue]);

  /** Reset all layouts by clearing the localstorage */
  const resetAllLayout = React.useCallback(() => {
    setValue({});
  }, [setValue]);

  return {
    cols: _cols,
    layoutIdList: _value?.idList,
    saveLayoutIds,
    getLayoutAsMap,
    updateLayout,
    resetLayout,
    resetAllLayout,
  };
}
