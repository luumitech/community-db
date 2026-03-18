import { cn } from '@heroui/react';
import React from 'react';
import { GridStackProvider, WidgetDefinition } from '~/view/base/grid-stack';

import styles from './styles.module.css';

interface Props {
  className?: string;
  id: string;
  widgets: WidgetDefinition[];
}

export function GridStackWithCard({
  className,
  id,
  widgets,
  ...props
}: React.PropsWithChildren<Props>) {
  return (
    <GridStackProvider
      className={cn(styles.gridWrapper, className)}
      id={id}
      initialOptions={{
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
      }}
      widgets={widgets}
      {...props}
    />
  );
}
