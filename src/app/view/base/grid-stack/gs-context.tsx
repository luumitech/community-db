import { cn } from '@heroui/react';
import {
  GridStack as GS,
  type GridStackNode,
  type GridStackOptions,
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

export type OnChangeFn = (grid: GS, items: GridStackNode[]) => void;
export type OnSizeChangeFn = (grid: GS, cols: number) => void;

export const GRID_STACK_INNER_PROVIDER_PROPS = [
  'options',
  'onChange',
  'onSizeChange',
] as const;

/** Properties expected to be passed by user */
export interface GridStackInnerProviderProps {
  options?: GridStackOptions;
  /** Fired when any widget is moved or resized. */
  onChange?: OnChangeFn;
  /** Fired when grid container size changes */
  onSizeChange?: OnSizeChangeFn;
}

interface Props extends GridStackInnerProviderProps {
  containerNode: HTMLDivElement;
}

export function GridStackInnerProvider({
  containerNode,
  options,
  onChange,
  onSizeChange,
  children,
}: React.PropsWithChildren<Props>) {
  const gsRef = React.useRef<GS | null>(null);
  const [grid, setGrid] = React.useState<GS>();
  const prevOptions = usePrevious(options);

  useMount(() => {
    const gs = GS.init(options, containerNode);
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
    gs = GS.init(options, containerNode);
    gsRef.current = gs;
    setGrid(gs);
  }, [containerNode, gsRef, prevOptions, options, setGrid]);

  // Re-install onChange handler when callback has changed
  React.useEffect(() => {
    const gs = gsRef.current;
    if (!gs) {
      return;
    }

    gs.off('change');
    if (onChange) {
      gs.on('change', (evt, items) => onChange(gs, items));
    }
  }, [gsRef, onChange]);

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
