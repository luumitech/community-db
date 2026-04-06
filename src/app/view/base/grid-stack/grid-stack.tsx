import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { GridStackFooter } from './grid-stack-footer';
import { GridStackHeader } from './grid-stack-header';
import { GridStackWidgets } from './grid-stack-widgets';
import {
  GRID_STACK_PROVIDER_PROPS,
  GridStackProvider,
  type GridStackProviderProps,
} from './gs-context';
import { GridStackWrapperProvider } from './gs-wrapper-context';

export const GRID_STACK_PROPS = [...GRID_STACK_PROVIDER_PROPS] as const;

export interface GridStackProps extends GridStackProviderProps {
  className?: string;
}

export const GridStack = function GridStack({
  className,
  children,
  ...props
}: React.PropsWithChildren<GridStackProps>) {
  const [headerNode, setHeaderNode] = React.useState<HTMLDivElement>();
  const [footerNode, setFooterNode] = React.useState<HTMLDivElement>();
  const [containerNode, setContainerNode] = React.useState<HTMLDivElement>();
  const gsProviderProps = R.pick(props, GRID_STACK_PROVIDER_PROPS);

  const headerNodeRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        setHeaderNode(node);
      }
    },
    [setHeaderNode]
  );

  const footerNodeRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        setFooterNode(node);
      }
    },
    [setFooterNode]
  );

  const containerNodeRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        setContainerNode(node);
      }
    },
    [setContainerNode]
  );

  return (
    <div className="grid-stack-wrapper">
      <div className="grid-stack-header" ref={headerNodeRef} />
      {headerNode && footerNode && (
        <GridStackWrapperProvider
          headerNode={headerNode}
          footerNode={footerNode}
        >
          <div ref={containerNodeRef} className={cn('grid-stack', className)}>
            {containerNode != null && (
              <GridStackProvider
                containerNode={containerNode}
                {...gsProviderProps}
              >
                {children}
              </GridStackProvider>
            )}
          </div>
        </GridStackWrapperProvider>
      )}
      <div className="grid-stack-footer" ref={footerNodeRef} />
    </div>
  );
};

/** Render widgets within the GridStack component */
GridStack.Widgets = GridStackWidgets;
/** Render elements above the grid */
GridStack.Header = GridStackHeader;
/** Render elements below the grid */
GridStack.Footer = GridStackFooter;
