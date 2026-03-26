import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import {
  GRID_STACK_INNER_PROVIDER_PROPS,
  GridStackInnerProvider,
  type GridStackInnerProviderProps,
} from './gs-context';

export const GRID_STACK_PROVIDER_PROPS = [
  ...GRID_STACK_INNER_PROVIDER_PROPS,
] as const;

export interface GridStackProviderProps extends GridStackInnerProviderProps {
  className?: string;
}

export function GridStackProvider({
  className,
  children,
  ...props
}: React.PropsWithChildren<GridStackProviderProps>) {
  const [containerNode, setContainerNode] = React.useState<HTMLDivElement>();
  const gsInnerProviderProps = R.pick(props, GRID_STACK_INNER_PROVIDER_PROPS);

  const containerNodeRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        setContainerNode(node);
      }
    },
    [setContainerNode]
  );

  return (
    <div ref={containerNodeRef} className={cn('grid-stack', className)}>
      {containerNode != null && (
        <GridStackInnerProvider
          containerNode={containerNode}
          {...gsInnerProviderProps}
        >
          {children}
        </GridStackInnerProvider>
      )}
    </div>
  );
}
