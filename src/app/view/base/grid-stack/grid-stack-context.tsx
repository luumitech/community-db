import { GridStack, type GridStackOptions } from 'gridstack';
import React from 'react';
import type { WidgetDefinition } from './_types';

interface ContextT {
  /** The set of widgets to be rendered in the grid. */
  widgets: WidgetDefinition[];
  /** The grid container Div */
  gridContainer?: HTMLDivElement;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
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
  initialOptions,
  widgets,
  children,
  ...props
}: React.PropsWithChildren<Props>) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const gridInstance = React.useRef<GridStack>(null);
  const [gridContainer, setGridContainer] = React.useState<HTMLDivElement>();

  React.useLayoutEffect(() => {
    if (!gridRef.current) {
      return;
    }

    setGridContainer(gridRef.current);

    if (gridInstance.current) {
      gridInstance.current.removeAll(false);
      gridInstance.current.destroy(false);
      gridInstance.current = null;
    }

    gridInstance.current = GridStack.init(initialOptions, gridRef.current);

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
  }, [initialOptions, widgets]);

  return (
    <Context.Provider
      value={{
        widgets,
        gridContainer,
      }}
      {...props}
    >
      <div ref={gridRef} className="grid-stack">
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
