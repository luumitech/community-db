'use client';
import React from 'react';
import { useGridStackContext } from './grid-stack-context';
import { Widget } from './widget';
import { WidgetContainer } from './widget-container';

export interface GridStackRenderProps {}

export function GridStackRender(props: GridStackRenderProps) {
  const { widgets, gridContainer } = useGridStackContext();

  return (
    <>
      {widgets.map((widget) => (
        <WidgetContainer key={widget.id} widget={widget} />
      ))}
      {gridContainer != null &&
        widgets.map((widget) => (
          <Widget
            key={widget.id}
            widget={widget}
            gridContainer={gridContainer}
          />
        ))}
    </>
  );
}
