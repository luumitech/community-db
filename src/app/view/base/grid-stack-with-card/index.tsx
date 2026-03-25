import { Button, cn } from '@heroui/react';
import { GridStack as GS } from 'gridstack';
import React from 'react';
import {
  GridStack,
  GridStackProvider,
  OnSizeChangeFn,
  type GridStackProps,
  type GridStackProviderProps,
  type OnChangeFn,
  type RenderItemFn,
} from '~/view/base/grid-stack';
import { Icon } from '~/view/base/icon';
import { useLocalStorageLayout } from './localstorage-layout';

import styles from './styles.module.css';

export * from './localstorage-layout';
export type { OnChangeFn, OnSizeChangeFn };

type CustomGridStackProps = Pick<GridStackProps, 'widgets'>;

interface Props extends GridStackProviderProps, CustomGridStackProps {
  className?: string;
  id: string;
  onRemove?: (grid: GS, widgetId: string) => void;
}

export const GridStackWithCard: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  id,
  options,
  onChange,
  onSizeChange,
  widgets,
  onRemove,
  children,
}) => {
  const { saveLayout } = useLocalStorageLayout(id);

  const customOnChange: OnChangeFn = React.useCallback(
    (grid, items) => {
      saveLayout(grid);
      onChange?.(grid, items);
    },
    [onChange, saveLayout]
  );

  const renderItem: RenderItemFn = React.useCallback(
    (grid, widget) => {
      return {
        className: 'group',
        children: (
          <Button
            className={cn(
              'absolute -top-1 -right-1',
              'z-10 rounded-full',
              'opacity-0 group-hover:opacity-100'
            )}
            size="sm"
            variant="shadow"
            isIconOnly
            onPress={() => onRemove?.(grid, widget.id)}
          >
            <Icon icon="cross" size={16} />
          </Button>
        ),
      };
    },
    [onRemove]
  );

  return (
    <GridStackProvider
      className={cn(styles.gridWrapper, className)}
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
      onSizeChange={onSizeChange}
    >
      <GridStack widgets={widgets} renderItem={renderItem} />
      {children}
    </GridStackProvider>
  );
};
