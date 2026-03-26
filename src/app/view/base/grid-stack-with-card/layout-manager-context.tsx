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
import type { WidgetFilterFn, WidgetMap } from './_type';
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

  /** Set of widget IDs that should be visible on the GridStack */
  const widgetIdList = React.useMemo(() => {
    return layoutIdList ?? (Object.keys(allowableWidgets) as WidgetId[]);
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

  /** Replace layout with given set of widget IDs */
  const setWidgets = React.useCallback(
    (idList: WidgetId[]) => {
      const currentSet = new Set(widgetIdList);
      idList.map((id) => currentSet.add(id));
      saveLayoutIds([...currentSet]);
    },
    [widgetIdList, saveLayoutIds]
  );

  /**
   * Add a delete widget button on the top right of the card, when the card is
   * hovered over
   */
  const renderItem: RenderItemFn<WidgetId> = React.useCallback(
    (gs, widget) => {
      return {
        className: 'group',
        children: (
          <Button
            className={cn(
              'absolute -top-1 -right-1',
              'z-10 rounded-full',
              'opacity-0 group-hover:opacity-100'
            )}
            size="sm"
            variant="shadow"
            isIconOnly
            onPress={() => removeWidget(widget.id)}
          >
            <Icon icon="cross" size={16} />
          </Button>
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
    const layoutMap = getLayout(grid);
    widgetIdList.forEach((widgetId) => {
      const widget = {
        ...allowableWidgets[widgetId],
        ...layoutMap[widgetId],
      };
      if (widgetFilter == null || widgetFilter?.(widget)) {
        result.push(widget);
      }
    });
    return result;
  }, [grid, getLayout, widgetIdList, allowableWidgets, widgetFilter]);

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
      <GridStack widgets={widgets} renderItem={renderItem} />
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
