import React from 'react';
import { WidgetDefinition } from './_types';
import { getWidgetDivId } from './widget-util';

interface Props {
  widget: WidgetDefinition;
}

export const WidgetContainer: React.FC<Props> = ({ widget }) => {
  const { id, x, y, w, h } = widget;

  return (
    <div
      className="grid-stack-item"
      gs-id={id}
      gs-x={x}
      gs-y={y}
      gs-w={w}
      gs-h={h}
    >
      <div id={getWidgetDivId(widget)} className="grid-stack-item-content" />
    </div>
  );
};
