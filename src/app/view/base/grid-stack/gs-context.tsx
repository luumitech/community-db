import { cn } from '@heroui/react';
import {
  GridStack as GS,
  type GridStackOptions,
  type GridStackWidget,
} from 'gridstack';
import React from 'react';
import { useMount, usePrevious, useUnmount } from 'react-use';
import * as R from 'remeda';

interface ContextT {
  /** Gridstack instance */
  grid: GS;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

export type OnChangeFn = (grid: GS, items: GridStackWidget[]) => void;
export type OnSizeChangeFn = (grid: GS, cols: number) => void;

export interface GridStackInnerProviderProps {
  containerNode: HTMLDivElement;
  options?: GridStackOptions;
  /** Fired when any widget is moved or resized. */
  onChange?: OnChangeFn;
  /** Fired when grid container size changes */
  onSizeChange?: OnSizeChangeFn;
}

export function GridStackInnerProvider({
  containerNode,
  options,
  onChange,
  onSizeChange,
  children,
}: React.PropsWithChildren<GridStackInnerProviderProps>) {
  const gsRef = React.useRef<GS | null>(null);
  const [grid, setGrid] = React.useState<GS>();
  const prevOptions = usePrevious(options);

  useMount(() => {
    const gs = intializeGridStack(containerNode, {
      options,
      onChange,
    });
    gsRef.current = gs;
    setGrid(gs);
  });

  useUnmount(() => {
    const gs = gsRef.current;
    if (gs) {
      gs.destroy(false);
      gsRef.current = null;
      setGrid(undefined);
    }
  });

  // Reinitialize grid instance when options are modified
  React.useLayoutEffect(() => {
    let gs = gsRef.current;
    if (!gs || !containerNode || R.isDeepEqual(prevOptions, options)) {
      return;
    }

    gs.removeAll(false);
    gs.destroy(false);
    gs = intializeGridStack(containerNode, {
      options,
      onChange,
    });
    gsRef.current = gs;
    setGrid(gs);
  }, [containerNode, gsRef, onChange, prevOptions, options, setGrid]);

  React.useEffect(() => {
    const gs = gsRef.current;
    if (!gs || !containerNode) {
      return;
    }

    const update = () => {
      onSizeChange?.(gs, gs.getColumn());
    };
    const observer = new ResizeObserver(update);
    observer.observe(containerNode);
    update();

    return () => observer.disconnect();
  }, [containerNode, gsRef, onSizeChange]);

  if (!grid) {
    return null;
  }

  return (
    <Context.Provider
      value={{
        grid,
      }}
    >
      {children}
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

interface InitGridStackOpt {
  options?: GridStackOptions;
  onChange?: OnChangeFn;
}
function intializeGridStack(
  containerNode: HTMLDivElement,
  opt?: InitGridStackOpt
) {
  const gs = GS.init(opt?.options, containerNode);

  gs.on('change', (_event, items) => {
    opt?.onChange?.(gs, items as GridStackWidget[]);
  });
  return gs;
}
