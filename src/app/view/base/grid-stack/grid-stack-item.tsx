import { cn } from '@heroui/react';
import React from 'react';
import type { Widget } from './_type';

type DivProps = React.ComponentProps<'div'>;

interface Props<WidgetId extends string> extends DivProps {
  widget: Widget<WidgetId>;
}

export const GridStackItem = React.forwardRef(
  <WidgetId extends string>(
    { className, widget, children, ...props }: Props<WidgetId>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const { id, x, y, w, h } = widget;

    return (
      <div
        className={cn('grid-stack-item', className)}
        ref={ref}
        gs-id={id}
        gs-x={x}
        gs-y={y}
        gs-w={w}
        gs-h={h}
        {...props}
      >
        <div className="grid-stack-item-content">{widget.content}</div>
        {children}
      </div>
    );
  }
) as (<WidgetId extends string>(
  props: Props<WidgetId> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  }
) => React.ReactElement) & { displayName?: string };

GridStackItem.displayName = 'GridStackItem';
