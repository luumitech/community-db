import { GridStack as GS } from 'gridstack';
import React from 'react';
import { Widget } from './_type';
import { GridStackItem } from './grid-stack-item';
import { useGridStackContext } from './gs-context';

import 'gridstack/dist/gridstack.min.css';

type DivProps = React.ComponentProps<'div'>;
export type RenderItemFn<WidgetId extends string> = (
  grid: GS,
  widget: Widget<WidgetId>
) => DivProps;

export interface GridStackProps<WidgetId extends string> {
  widgets: Widget<WidgetId>[];
  /** Passed to each widget to render additional components in each grid item */
  renderItem?: RenderItemFn<WidgetId>;
}

export function GridStack<WidgetId extends string>({
  widgets,
  renderItem,
}: GridStackProps<WidgetId>) {
  const { grid } = useGridStackContext();
  const itemElsRef = React.useRef(new Map<WidgetId, HTMLDivElement>());

  React.useEffect(() => {
    if (!grid) {
      return;
    }
    // Incoming set of widget IDs that should be rendered
    const widgetIdSet = new Set(widgets.map((w) => w.id));

    // Gather list of widget nodes managed by GridStack currently
    const updateSet = new Set<WidgetId>();
    const removeSet = new Set<WidgetId>();
    grid.engine.nodes.forEach(({ id: _id, el }) => {
      const id = _id as WidgetId | undefined;
      if (id != null) {
        if (widgetIdSet.has(id)) {
          updateSet.add(id);
        } else {
          removeSet.add(id);
        }
      } else if (el) {
        // We don't expect to generate nodes without id
        console.error('grid-stack-item without id found, removed.');
        grid.removeWidget(el, false);
      }
    });

    // Don't recalculate layouts until all widget layouts have been done
    grid.batchUpdate(true);

    // Remove widgets that no longer needs to be rendered
    removeSet.forEach((id) => {
      const el = itemElsRef.current.get(id);
      if (el) {
        grid.removeWidget(el, false);
        itemElsRef.current.delete(id);
      }
    });

    widgets.forEach(({ content: _content, ...widgetOpts }) => {
      const { id } = widgetOpts;
      const el = itemElsRef.current.get(id);
      if (!el) {
        return;
      }
      const isNew = !updateSet.has(id);
      if (isNew) {
        grid.makeWidget(el, widgetOpts);
      } else {
        grid.update(el, widgetOpts);
      }
    });
    grid.batchUpdate(false);
  }, [grid, widgets]);

  const initItemRefs = React.useCallback(
    (el: HTMLDivElement | null, id: WidgetId) => {
      if (el && !itemElsRef.current.has(id)) {
        itemElsRef.current.set(id, el);
      }
    },
    []
  );

  return widgets.map((widget) => {
    return (
      <GridStackItem
        key={widget.id}
        ref={(el) => initItemRefs(el, widget.id)}
        widget={widget}
        {...renderItem?.(grid, widget)}
      />
    );
  });
}
