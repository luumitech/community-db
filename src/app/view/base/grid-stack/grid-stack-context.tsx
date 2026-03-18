import { cn } from '@heroui/react';
import { GridStack, type GridStackOptions } from 'gridstack';
import React from 'react';
import { usePrevious, useUnmount, useUpdate } from 'react-use';
import * as R from 'remeda';
import type { WidgetDefinition } from './_type';
import { Widget } from './widget';
import { isWidgetDefinitionsEqual } from './widget-util';

interface ContextT {
  grid?: GridStack;
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
  const gridRef = React.useRef<GridStack>(null);
  const [grid, setGrid] = React.useState<GridStack>();
  const [gridNode, setGridNode] = React.useState<HTMLDivElement>();
  const prevInitialOptions = usePrevious(initialOptions);
  const previousWidget = usePrevious(widgets);
  const forceRerender = useUpdate();

  const gridNodeRef = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      setGridNode(node);
    }
  }, []);

  useUnmount(() => {
    if (gridRef.current) {
      gridRef.current.removeAll(true);
      gridRef.current.destroy(true);
    }
  });

  const initGrid = React.useCallback(() => {
    if (gridNode) {
      let _grid = gridRef.current;
      if (_grid != null) {
        _grid.removeAll(false);
        _grid.destroy(false);
      }
      _grid = GridStack.init(initialOptions, gridNode);
      setGrid(_grid);
      gridRef.current = _grid;
    }
  }, [gridNode, initialOptions]);

  React.useEffect(() => {
    initGrid();
  }, [initGrid]);

  React.useLayoutEffect(() => {
    const _grid = gridRef.current;
    // Force Re-render of widgets on changes
    if (
      _grid &&
      previousWidget &&
      !isWidgetDefinitionsEqual(previousWidget, widgets)
    ) {
      _grid.load(widgets);
      forceRerender();
    }
  }, [previousWidget, widgets, forceRerender]);

  React.useLayoutEffect(() => {
    const _grid = gridRef.current;
    // Reinitialize grid instance when intialOptions are modified
    if (
      _grid &&
      prevInitialOptions &&
      !R.isDeepEqual(prevInitialOptions, initialOptions)
    ) {
      _grid.removeAll(false);
      _grid.destroy(false);
      initGrid();
    }
  }, [prevInitialOptions, initialOptions, initGrid]);

  return (
    <Context.Provider
      value={{
        grid,
        widgets,
      }}
      {...props}
    >
      <div ref={gridNodeRef} id={id} className={cn('grid-stack', className)}>
        {widgets.map((widget) => (
          <Widget key={widget.id} widget={widget} />
        ))}
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
