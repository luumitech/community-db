import { cn } from '@heroui/react';
import { GridStack as GS } from 'gridstack';
import React from 'react';

interface ContextT {
  /** The node that wraps the entire grid system */
  containerNode?: HTMLDivElement;
  /** The GridStack instance reference */
  gsRef: React.RefObject<GS | null>;
  /**
   * Current Gridstack instance, allow children component to perform
   * re-rendering whenver grid instance is modified
   */
  grid?: GS;
  setGrid: (grid: GS) => void;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  className?: string;
}

export function GridStackProvider({
  className,
  children,
  ...props
}: React.PropsWithChildren<Props>) {
  const [containerNode, setContainerNode] = React.useState<HTMLDivElement>();
  const gsRef = React.useRef<GS | null>(null);
  const [grid, setGrid] = React.useState<GS>();

  const containerNodeRef = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      setContainerNode(node);
    }
  }, []);

  return (
    <Context.Provider
      value={{
        containerNode,
        gsRef,
        grid,
        setGrid,
      }}
      {...props}
    >
      <div ref={containerNodeRef} className={cn('grid-stack', className)}>
        {containerNode != null && children}
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
