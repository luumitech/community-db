import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { Ellipsis } from './ellipsis';

export { Ellipsis } from './ellipsis';

type DivProps = React.ComponentProps<'div'>;

/**
 * Customize ellipsis element to render
 *
 * @param hidden List of items not shown on screen
 * @param visible List of visible items shown on screen
 */
export type EllipsisFn = (
  hidden: React.ReactNode[],
  visible: React.ReactNode[]
) => React.ReactNode;

export interface TruncateProps extends DivProps {
  className?: string;
  /** Space between children, in px. Default: 4. */
  gap?: number;
  /**
   * Shown after the last visible child when some children are hidden. Either a
   * node or a function of the hidden count. Default is the `Ellipsis`
   * component.
   */
  ellipsis?: React.ReactNode | EllipsisFn;
}

/**
 * Renders as many leading children as fit completely inside the parent and
 * stops at the first child that would be clipped. If any children are hidden,
 * an ellipsis is shown after the last visible one.
 *
 * Every child is rendered once, in a wrapper. Hidden children stay mounted (so
 * state and effects are preserved) but are taken out of flow and made invisible
 * so they can still be measured. A ResizeObserver recomputes the visible count
 * whenever the container, a child, or the ellipsis changes size. The
 * computation runs in a layout effect, so there is no flash of overflow.
 *
 * Usage
 *
 *     <div className="flex">
 *       <Truncate gap={6}>
 *         <Tag>React</Tag>
 *         <Tag>TypeScript</Tag>
 *         <Tag>GraphQL</Tag>
 *         <Tag>Postgres</Tag>
 *       </Truncate>
 *     </div>
 *
 *     // Custom ellipsis showing how many are hidden:
 *     <Truncate ellipsis={(n) => <span>+{n} more</span>}>...</Truncate>
 */
export const Truncate: React.FC<React.PropsWithChildren<TruncateProps>> = ({
  className,
  gap = 4,
  ellipsis = <Ellipsis />,
  children,
  ...props
}) => {
  const items = React.Children.toArray(children);
  const total = items.length;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const ellipsisRef = React.useRef<HTMLDivElement>(null);

  // Start optimistic (everything visible); corrected before first paint.
  const [visibleCount, setVisibleCount] = React.useState<number>(total);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const measure = (): void => {
      const available = container.clientWidth;
      const widths = itemRefs.current
        .slice(0, total)
        .map((el) => (el ? el.getBoundingClientRect().width : 0));
      const ellipsisWidth = ellipsisRef.current
        ? ellipsisRef.current.getBoundingClientRect().width
        : 0;

      // Width of the first n children laid out with `gap` between them.
      const usedBy = (n: number): number => {
        let sum = 0;
        for (let i = 0; i < n; i++) {
          sum += widths[i];
        }
        return sum + gap * Math.max(0, n - 1);
      };

      let fit = 0;
      for (let n = 1; n <= total; n++) {
        if (usedBy(n) > available) {
          break;
        } // first clipped child: stop here
        fit = n;
      }

      // If something is hidden, the ellipsis needs room too. Give up children
      // from the end until the ellipsis fits alongside them.
      if (fit < total) {
        while (fit > 0 && usedBy(fit) + gap + ellipsisWidth > available) {
          fit--;
        }
      }

      setVisibleCount((prev) => (prev === fit ? prev : fit));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    itemRefs.current.slice(0, total).forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });
    if (ellipsisRef.current) {
      observer.observe(ellipsisRef.current);
    }

    return () => observer.disconnect();
  }, [total, gap]);

  const shown = Math.min(visibleCount, total);
  const hiddenCount = total - shown;
  const hasHidden = hiddenCount > 0;

  const [visibleList, hiddenList] = React.useMemo(() => {
    return R.partition(
      React.Children.toArray(children),
      (elem, idx) => idx < shown
    );
  }, [children, shown]);

  // Hidden nodes stay mounted and measurable but take no space and are invisible.
  const hiddenClass = cn('pointer-events-none invisible absolute top-0 left-0');

  return (
    <div
      ref={containerRef}
      className={twMerge(
        'relative min-w-0 overflow-hidden',
        /**
         * If parent is flex-col, you should pass 'flex-none', othewise 'flex-1'
         * will affect its height
         */
        'flex flex-1 flex-nowrap items-center',
        className
      )}
      style={{ gap }}
      {...props}
    >
      {items.map((child, i) => {
        const isVisible = i < shown;
        // Children.toArray assigns stable keys to elements; fall back to index.
        const key =
          React.isValidElement(child) && child.key != null ? child.key : i;
        return (
          <div
            key={key}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            aria-hidden={isVisible ? undefined : true}
            className={cn('w-max flex-none', {
              [hiddenClass]: !isVisible,
            })}
          >
            {child}
          </div>
        );
      })}

      <div
        ref={ellipsisRef}
        aria-hidden={hasHidden ? undefined : true}
        className={cn('w-max flex-none', {
          [hiddenClass]: !hasHidden,
        })}
      >
        {typeof ellipsis === 'function'
          ? ellipsis(hiddenList, visibleList)
          : ellipsis}
      </div>
    </div>
  );
};
