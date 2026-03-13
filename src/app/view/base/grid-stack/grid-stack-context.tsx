import { cn } from '@heroui/react';
import { GridStack, type GridStackOptions } from 'gridstack';
import React from 'react';
import type { WidgetDefinition } from './_type';

interface ContextT {
  /** The set of widgets to be rendered in the grid. */
  widgets: WidgetDefinition[];
  /** The grid container Div */
  gridNode?: HTMLDivElement;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  /** Applied to the outer grid container */
  className?: string;
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
  initialOptions,
  widgets,
  children,
  ...props
}: React.PropsWithChildren<Props>) {
  const gridInstance = React.useRef<GridStack>(null);
  const [gridNode, setGridNode] = React.useState<HTMLDivElement>();

  const gridRef = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }
    setGridNode(node);
  }, []);

  React.useLayoutEffect(() => {
    if (!gridNode) {
      return;
    }

    if (gridInstance.current) {
      gridInstance.current.removeAll(false);
      gridInstance.current.destroy(false);
      gridInstance.current = null;
    }

    gridInstance.current = GridStack.init(initialOptions, gridNode);

    const grid = gridInstance.current;

    grid.on('change', () => {
      const layout = grid.save(false);
      localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    });

    return () => {
      grid.removeAll(false);
      grid.destroy(false);
      gridInstance.current = null;
    };
  }, [initialOptions, widgets, gridNode]);

  return (
    <Context.Provider
      value={{
        widgets,
        gridNode,
      }}
      {...props}
    >
      <div ref={gridRef} className={cn('grid-stack', className)}>
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
