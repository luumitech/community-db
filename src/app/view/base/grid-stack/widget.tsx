import React from 'react';
import { createPortal } from 'react-dom';
import { WidgetDefinition } from './_type';

interface Props {
  widget: WidgetDefinition;
}

export const Widget: React.FC<Props> = ({ widget }) => {
  const [widgetNode, setWidgetNode] = React.useState<HTMLDivElement>();
  const { id, x, y, w, h } = widget;

  const widgetNodeRef = React.useCallback((node: HTMLDivElement) => {
    setWidgetNode(node);
  }, []);

  const Component = widget.component;

  return (
    <>
      <div
        className="grid-stack-item"
        gs-id={id}
        gs-x={x}
        gs-y={y}
        gs-w={w}
        gs-h={h}
      >
        <div
          ref={widgetNodeRef}
          id={`widget-${widget.id}`}
          className="grid-stack-item-content"
        />
      </div>
      {widgetNode != null &&
        createPortal(<Component {...widget.props} />, widgetNode)}
    </>
  );
};
