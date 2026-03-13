import { cn } from '@heroui/react';
import { GridStack, type GridStackOptions } from 'gridstack';
import React from 'react';
import { usePreviousDistinct, useUpdate } from 'react-use';
import * as R from 'remeda';
import type { WidgetDefinition } from './_type';
import { useLayoutUtil } from './layout-util';

interface ContextT {
  /** GridStack instance */
  gridStack?: GridStack | null;
  /** The grid container Div */
  gridNode?: HTMLDivElement;
  /** The set of widgets to be rendered in the grid. */
  widgets: WidgetDefinition[];
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  /** Applied to the outer grid container */
  className?: string;
  /**
   * Unique ID for each gridstack, so you can render multiple gridstacks per
   * page
   */
  id: string;
  /**
   * Initial options for the GridStack instance. This allows you to customize
   * the behavior and appearance of the grid, such as setting the cell height,
   * margin, number of columns, and responsive breakpoints.
   */
  initialOptions?: GridStackOptions;
  /** The set of widgets to be rendered in the grid. */
  widgets: WidgetDefinition[];
}

export function GridStackProvider({
  className,
  id,
  initialOptions,
  widgets,
  children,
  ...props
}: React.PropsWithChildren<Props>) {
  const [gridStack, setGridStack] = React.useState<GridStack>();
  const [gridNode, setGridNode] = React.useState<HTMLDivElement>();
  const prevInitialOptions = usePreviousDistinct(initialOptions, R.isDeepEqual);
  const previousWidget = usePreviousDistinct(widgets, R.isDeepEqual);
  const { saveLayout, restoreLayout } = useLayoutUtil(id);
  const forceRerender = useUpdate();

  const gridRef = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }
    setGridNode(node);
  }, []);

  const initGrid = React.useCallback(() => {
    if (gridNode) {
      const grid = GridStack.init(initialOptions, gridNode);
      // Here is where you can add grid listeners
      return grid;
    }
  }, [gridNode, initialOptions]);

  React.useLayoutEffect(() => {
    // Force Re-render of widgets on changes
    if (previousWidget && previousWidget !== widgets && gridStack) {
      gridStack.load(widgets);
      forceRerender();
    }
  }, [previousWidget, widgets, gridStack, forceRerender]);

  React.useLayoutEffect(() => {
    if (
      prevInitialOptions &&
      prevInitialOptions !== initialOptions &&
      gridStack
    ) {
      gridStack.removeAll(false);
      gridStack.destroy(false);
      setGridStack(initGrid());
    }

    if (!gridStack) {
      setGridStack(initGrid());
    }
  }, [
    prevInitialOptions,
    initialOptions,
    gridStack,
    initGrid,
    setGridStack,
    previousWidget,
    widgets,
  ]);

  return (
    <Context.Provider
      value={{
        widgets,
        gridNode,
      }}
      {...props}
    >
      <div ref={gridRef} id={id} className={cn('grid-stack', className)}>
        {children}
      </div>
    </Context.Provider>
  );
}

export function useGridStackContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      'useGridStackContext must be used within a GridStackProvider'
    );
  }
  return context;
}
