import { GridStack as GS } from 'gridstack';
import React from 'react';
import { Widget } from './_type';
import { GridStackItem } from './grid-stack-item';
import { useGridStackContext } from './gs-context';

import 'gridstack/dist/gridstack.min.css';

type DivProps = React.ComponentProps<'div'>;
export type RenderItemFn = (grid: GS, widget: Widget) => DivProps;

export interface GridStackProps {
  widgets: Widget[];
  /** Passed to each widget to render additional components in each grid item */
  renderItem?: RenderItemFn;
}

export const GridStack: React.FC<GridStackProps> = ({
  widgets,
  renderItem,
}) => {
  const { grid } = useGridStackContext();
  const itemElsRef = React.useRef(new Map<string, HTMLDivElement>());
  const prevIdsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    const currentIds = new Set(widgets.map((w) => w.id));

    // Remove widgets that no longer needs to be rendered
    prevIdsRef.current
      .filter((id) => !currentIds.has(id))
      .forEach((id) => {
        const el = itemElsRef.current.get(id);
        if (el) {
          grid.removeWidget(el, false);
          itemElsRef.current.delete(id);
        }
      });

    grid.batchUpdate(true);
    widgets.forEach(({ content: _content, ...widgetOpts }) => {
      const { id } = widgetOpts;
      const el = itemElsRef.current.get(id);
      if (!el) {
        return;
      }
      const isNew = !prevIdsRef.current.includes(id);
      if (isNew) {
        grid.makeWidget(el, widgetOpts);
      } else {
        grid.update(el, widgetOpts);
      }
    });
    grid.batchUpdate(false);

    prevIdsRef.current = widgets.map((w) => w.id);
  }, [grid, widgets]);

  const initItemRefs = React.useCallback(
    (el: HTMLDivElement | null, id: string) => {
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
};
