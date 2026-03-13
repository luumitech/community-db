import React from 'react';
import { WidgetDefinition } from './_type';
import { WidgetPortal } from './widget-portal';
import { getWidgetDivId } from './widget-util';

interface Props {
  widget: WidgetDefinition;
  gridContainer: HTMLDivElement;
}

/** Renders the content of a widget within its container. */
export const Widget: React.FC<Props> = ({ widget, gridContainer }) => {
  const container = gridContainer.querySelector(`#${getWidgetDivId(widget)}`);
  if (!container) {
    return null;
  }

  const Component = widget.component;
  return (
    <WidgetPortal key={widget.id} container={container}>
      <Component {...widget.props} />
    </WidgetPortal>
  );
};
