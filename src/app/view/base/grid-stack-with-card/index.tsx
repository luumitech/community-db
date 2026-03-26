import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import {
  GRID_STACK_PROVIDER_PROPS,
  GridStackProvider,
  type GridStackProviderProps,
  type OnChangeFn,
} from '~/view/base/grid-stack';
import {
  LAYOUT_MANAGER_PROPS,
  LayoutManagerProvider,
  type LayoutManagerProps,
} from './layout-manager-context';
import { useLocalStorageLayout } from './localstorage-layout';

import styles from './styles.module.css';

export type * from './_type';
export { useLayoutManagerContext } from './layout-manager-context';

interface Props<WidgetId extends string>
  extends LayoutManagerProps<WidgetId>, GridStackProviderProps {
  className?: string;
  /** Suffix attached to localstorage key to store grid layout information */
  lsSuffix: string;
}

export function GridStackWithCard<WidgetId extends string>({
  className,
  lsSuffix,
  children,
  ...props
}: React.PropsWithChildren<Props<WidgetId>>) {
  const lsUtil = useLocalStorageLayout<WidgetId>(lsSuffix);
  const { updateLayout } = lsUtil;

  const gsProviderProps = R.pick(props, GRID_STACK_PROVIDER_PROPS);
  const layoutMgrProps = R.pick(props, LAYOUT_MANAGER_PROPS);
  const { options, onChange } = gsProviderProps;

  const customOnChange: OnChangeFn = React.useCallback(
    (grid, items) => {
      // items only contain items that have been changed
      updateLayout(grid, items);
      onChange?.(grid, items);
    },
    [updateLayout, onChange]
  );

  return (
    <GridStackProvider
      className={cn(styles.gridWrapper, className)}
      {...gsProviderProps}
      options={{
        margin: 8,
        cellHeight: '50px',
        columnOpts: {
          breakpointForWindow: true,
          breakpoints: [
            { w: 1280, c: 12 }, // xl
            { w: 1024, c: 12 }, // lg
            { w: 768, c: 1 }, // md
            { w: 640, c: 1 }, // sm
          ],
        },
        ...options,
      }}
      onChange={customOnChange}
    >
      <LayoutManagerProvider {...layoutMgrProps} lsUtil={lsUtil}>
        {children}
      </LayoutManagerProvider>
    </GridStackProvider>
  );
}
