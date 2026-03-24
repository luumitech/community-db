import { GridStack as GS, GridStackOptions, GridStackWidget } from 'gridstack';
import React from 'react';
import { useMount, usePrevious, useUnmount } from 'react-use';
import * as R from 'remeda';
import { useGridStackContext } from '.';
import { Widget } from './_type';
import { GridStackItem } from './grid-stack-item';

import 'gridstack/dist/gridstack.min.css';

type DivProps = React.ComponentProps<'div'>;

export type OnChangeFn = (grid: GS, items: GridStackWidget[]) => void;
export type OnSizeChangeFn = (grid: GS, cols: number) => void;
export type RenderItemFn = (widget: Widget) => DivProps;

export interface GridStackProps {
  widgets: Widget[];
  options?: GridStackOptions;
  /** Fired when any widget is moved or resized. */
  onChange?: OnChangeFn;
  /** Fired when grid container size changes */
  onSizeChange?: OnSizeChangeFn;
  /** Passed to each widget to render additional components in each grid item */
  renderItem?: RenderItemFn;
}

export const GridStack: React.FC<GridStackProps> = ({
  widgets,
  options,
  onChange,
  onSizeChange,
  renderItem,
}) => {
  const { containerNode, gsRef, grid, setGrid } = useGridStackContext();
  const itemElsRef = React.useRef(new Map<string, HTMLDivElement>());
  const prevIdsRef = React.useRef<string[]>([]);
  const prevOptions = usePrevious(options);

  useMount(() => {
    if (!containerNode) {
      return;
    }

    const gs = intializeGridStack(containerNode, {
      options,
      onChange,
    });
    gsRef.current = gs;
    setGrid(gs);
  });

  useUnmount(() => {
    const gs = gsRef.current;
    if (gs) {
      gs.destroy(false);
      gsRef.current = null;
    }
  });

  React.useEffect(() => {
    const gs = gsRef.current;
    if (!gs) {
      return;
    }

    const currentIds = new Set(widgets.map((w) => w.id));

    // Remove widgets that no longer needs to be rendered
    prevIdsRef.current
      .filter((id) => !currentIds.has(id))
      .forEach((id) => {
        const el = itemElsRef.current.get(id);
        if (el) {
          gs.removeWidget(el, false);
          itemElsRef.current.delete(id);
        }
      });

    gs.batchUpdate(true);
    widgets.forEach(({ content: _content, ...widgetOpts }) => {
      const { id } = widgetOpts;
      const el = itemElsRef.current.get(id);
      if (!el) {
        return;
      }
      const isNew = !prevIdsRef.current.includes(id);
      if (isNew) {
        gs.makeWidget(el, widgetOpts);
      } else {
        gs.update(el, widgetOpts);
      }
    });
    gs.batchUpdate(false);

    prevIdsRef.current = widgets.map((w) => w.id);
  }, [containerNode, gsRef, widgets]);

  const initItemRefs = React.useCallback(
    (el: HTMLDivElement | null, id: string) => {
      if (el && !itemElsRef.current.has(id)) {
        itemElsRef.current.set(id, el);
      }
    },
    []
  );

  // Reinitialize grid instance when options are modified
  React.useLayoutEffect(() => {
    let gs = gsRef.current;
    if (!gs || !containerNode || R.isDeepEqual(prevOptions, options)) {
      return;
    }

    gs.removeAll(false);
    gs.destroy(false);
    gs = intializeGridStack(containerNode, {
      options,
      onChange,
    });
    gsRef.current = gs;
    setGrid(gs);
  }, [containerNode, gsRef, onChange, prevOptions, options, setGrid]);

  React.useEffect(() => {
    const gs = gsRef.current;
    if (!gs || !containerNode) {
      return;
    }

    const update = () => {
      onSizeChange?.(gs, gs.getColumn());
    };
    const observer = new ResizeObserver(update);
    observer.observe(containerNode);
    update();

    return () => observer.disconnect();
  }, [containerNode, gsRef, onSizeChange]);

  return widgets.map((widget) => {
    return (
      <GridStackItem
        key={widget.id}
        ref={(el) => initItemRefs(el, widget.id)}
        widget={widget}
        {...renderItem?.(widget)}
      />
    );
  });
};

interface InitGridStackOpt {
  options?: GridStackOptions;
  onChange?: OnChangeFn;
}
function intializeGridStack(
  containerNode: HTMLDivElement,
  opt?: InitGridStackOpt
) {
  const gs = GS.init(opt?.options, containerNode);

  gs.on('change', (_event, items) => {
    opt?.onChange?.(gs, items as GridStackWidget[]);
  });
  return gs;
}
