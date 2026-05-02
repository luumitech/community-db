import { Button, cn } from '@heroui/react';
import { GridStack as GS } from 'gridstack';
import React from 'react';
import {
  GridStack,
  useGridStackContext,
  type RenderItemFn,
  type Widget,
} from '~/view/base/grid-stack';
import { Icon } from '~/view/base/icon';
import type { WidgetFilterFn, WidgetInfo, WidgetMap } from './_type';
import { ConfigDrawer } from './config-drawer';
import { useLocalStorageLayout } from './localstorage-layout';

interface ContextT<WidgetId extends string> {
  /** List of all widget IDs that should be rendered on screen */
  widgetIdList: WidgetId[];
  /** Add a widget of a given ID */
  addWidget: (id: WidgetId) => void;
  /** Remove a widget of a given ID */
  removeWidget: (id: WidgetId) => void;
  /** Render given set of widgets of a given ID */
  setWidgets: (idList: WidgetId[]) => void;
  /** Reset the saved layout of the current breakpoint */
  resetLayout: (gs: GS) => void;
  /** Reset all saved layouts */
  resetAllLayout: () => void;
}

// @ts-expect-error: intentionally leaving default value to be empty
const ContextWithoutType = React.createContext<ContextT<string>>();

function getContext<WidgetId extends string>() {
  return ContextWithoutType as unknown as React.Context<ContextT<WidgetId>>;
}

export const LAYOUT_MANAGER_PROPS = [
  'allowableWidgets',
  'widgetFilter',
] as const;

/** Properties expected to be passed by user */
export interface LayoutManagerProps<WidgetId extends string> {
  /** List of all allowable widgets that can be displayed in the grid */
  allowableWidgets: WidgetMap<WidgetId>;
  /** Custom filter function to control if the widget should be shown */
  widgetFilter?: WidgetFilterFn<WidgetId>;
}

interface Props<WidgetId extends string> extends LayoutManagerProps<WidgetId> {
  /** Local storage utility */
  lsUtil: ReturnType<typeof useLocalStorageLayout<WidgetId>>;
}

export function LayoutManagerProvider<WidgetId extends string>({
  allowableWidgets,
  widgetFilter,
  lsUtil,
  children,
}: React.PropsWithChildren<Props<WidgetId>>) {
  const { grid } = useGridStackContext();
  const {
    layoutIdList,
    saveLayoutIds,
    getLayout,
    resetLayout,
    resetAllLayout,
  } = lsUtil;

  /**
   * This is not memoized because we want the latest layoutMap whenever
   * localstorage is altered
   */
  const layoutMap = getLayout(grid);

  /** Set of widget IDs that should be visible on the GridStack */
  const widgetIdList = React.useMemo(() => {
    if (layoutIdList) {
      return layoutIdList;
    }

    const defaultWidgetIds: WidgetId[] = [];
    Object.keys(allowableWidgets).forEach((id) => {
      const widgetId = id as WidgetId;
      if (!allowableWidgets[widgetId].hide) {
        defaultWidgetIds.push(widgetId);
      }
    });
    return defaultWidgetIds;
  }, [layoutIdList, allowableWidgets]);

  /** Add a widget */
  const addWidget = React.useCallback(
    (id: WidgetId) => {
      const currentSet = new Set(widgetIdList);
      currentSet.add(id);
      saveLayoutIds([...currentSet]);
    },
    [widgetIdList, saveLayoutIds]
  );

  /** Remove a widget */
  const removeWidget = React.useCallback(
    (id: WidgetId) => {
      const currentSet = new Set(widgetIdList);
      currentSet.delete(id);
      saveLayoutIds([...currentSet]);
    },
    [widgetIdList, saveLayoutIds]
  );

  /** Replace current set of widget IDs with new ones */
  const setWidgets = React.useCallback(
    (idList: WidgetId[]) => {
      saveLayoutIds(idList);
    },
    [saveLayoutIds]
  );

  /**
   * Overlay a widget control bar on top of all cards
   *
   * - It serves as the widget drag bar
   * - It houses the widget control (i.e remove button)
   */
  const renderItem: RenderItemFn<WidgetId> = React.useCallback(
    (gs, widget) => {
      return {
        children: (
          <div
            className={cn(
              'widget-control-bar drag-handle',
              'cursor-grab active:cursor-grabbing',
              // Match the Card default rounded-ness
              'rounded-t-[14px] px-3',
              'flex items-center gap-2',
              'z-10'
            )}
          >
            <Icon icon="drag-handle" />
            {widget.title}
            <Button
              className={cn(
                'widget-hover-control',
                'ml-auto',
                'h-3 w-3 min-w-3'
              )}
              color="danger"
              isIconOnly
              onPress={() => removeWidget(widget.id)}
            >
              <Icon icon="cross" size={12} />
            </Button>
          </div>
        ),
      };
    },
    [removeWidget]
  );

  /**
   * Combine default widget information (in allowableWidgets), and the
   * information stored in layout to produce list of widgets to show
   */
  const widgets = React.useMemo<Widget<WidgetId>[]>(() => {
    const result: Widget<WidgetId>[] = [];
    for (const widgetId of widgetIdList) {
      const defaultWidget = allowableWidgets[widgetId].widget;
      if (!defaultWidget) {
        // This is not suppose to happen, but add it as a guard
        // in case, we don't know how to render this widgetId
        console.error(`Unknown widget ${widgetId} encountered, skipping`);
        continue;
      }
      const widget = {
        ...allowableWidgets[widgetId].widget,
        ...layoutMap[widgetId],
      };
      if (widgetFilter == null || widgetFilter?.(widget)) {
        result.push(widget);
      }
    }
    return result;
  }, [layoutMap, widgetIdList, allowableWidgets, widgetFilter]);

  const Context = getContext<WidgetId>();

  return (
    <Context.Provider
      value={{
        widgetIdList,
        addWidget,
        removeWidget,
        setWidgets,
        resetLayout,
        resetAllLayout,
      }}
    >
      <GridStack.Widgets widgets={widgets} renderItem={renderItem} />
      <GridStack.Footer>
        <ConfigDrawer allowableWidgets={allowableWidgets} />
      </GridStack.Footer>
      {children}
    </Context.Provider>
  );
}

export function useLayoutManagerContext<WidgetId extends string>() {
  const Context = getContext<WidgetId>();
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      'useLayoutManagerContext must be used within a GridStackWithCard'
    );
  }
  return context;
}
