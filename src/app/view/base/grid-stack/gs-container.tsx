import { cn } from '@heroui/react';
import React from 'react';
import {
  GridStackInnerProvider,
  type GridStackInnerProviderProps,
} from './gs-context';

type InnerProps = Omit<GridStackInnerProviderProps, 'containerNode'>;

export interface GridStackProviderProps extends InnerProps {
  className?: string;
}

export function GridStackProvider({
  className,
  children,
  ...props
}: React.PropsWithChildren<GridStackProviderProps>) {
  const [containerNode, setContainerNode] = React.useState<HTMLDivElement>();

  const containerNodeRef = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      setContainerNode(node);
    }
  }, []);

  return (
    <div ref={containerNodeRef} className={cn('grid-stack', className)}>
      {containerNode != null && (
        <GridStackInnerProvider containerNode={containerNode} {...props}>
          {children}
        </GridStackInnerProvider>
      )}
    </div>
  );
}
