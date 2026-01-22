import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { Ellipsis } from './ellipsis';

// Default ellipsis component
export { Ellipsis } from './ellipsis';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface TruncateProps extends DivProps {
  /**
   * Optional ellipsis element to render
   *
   * @param invisible List of items not shown in Truncate children
   * @param visible List of visible items under Truncate children
   */
  ellipsis?: (
    invisible: React.ReactNode[],
    visible: React.ReactNode[]
  ) => React.ReactNode;
}

export const Truncate: React.FC<React.PropsWithChildren<TruncateProps>> = ({
  className,
  ellipsis,
  children,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const childCount = React.Children.toArray(children).length;
  const [visibleCount, setVisibleCount] = React.useState(childCount);

  React.useLayoutEffect(() => {
    if (!containerRef.current || !measureRef.current) {
      return;
    }

    const container = containerRef.current;
    const measure = measureRef.current;

    const calculate = () => {
      const containerWidth = container.clientWidth;
      const measureWidth = measure.clientWidth;
      const measureChildren = Array.from(measure.children) as HTMLElement[];
      const measureCount = measureChildren.length;

      /**
       * Measure gap width
       *
       * - Measurement container has an ellipsis prepended to the children
       *
       * @example
       *
       *       ...(pad)item1(pad)item2(pad)item3
       *       |                               |
       *       +-------  measureWidth  --------+
       */
      const totalElemWidth = R.sumBy(
        measureChildren,
        (elem) => elem.offsetWidth
      );
      const gap = (measureWidth - totalElemWidth) / measureCount;

      // The first element in the measure div is the ellipsis element
      const ellipsisWidth = measureChildren[0].offsetWidth;

      let count = 0;
      for (let usedWidth = 0; count < measureCount; count++) {
        const elem = measureChildren[count];
        const elemWidth = elem.offsetWidth;

        if (count === measureCount - 1) {
          // No need to render ellipsis when all children are rendered
          usedWidth -= ellipsisWidth + gap;
        }
        if (usedWidth + gap + elemWidth > containerWidth) {
          break;
        }
        usedWidth += gap + elemWidth;
      }
      setVisibleCount(count - 1);
    };

    calculate();

    const observer = new ResizeObserver(calculate);
    observer.observe(container);

    return () => observer.disconnect();
  }, [childCount, children]);

  const [visibleList, invisibleList] = React.useMemo(() => {
    return R.partition(
      React.Children.toArray(children),
      (elem, idx) => idx < visibleCount
    );
  }, [children, visibleCount]);

  return (
    <>
      {/* Visible container */}
      <div ref={containerRef} className={className} {...props}>
        {visibleList.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
        {invisibleList.length > 0 && (
          <span>{ellipsis?.(invisibleList, visibleList) ?? <Ellipsis />}</span>
        )}
      </div>

      {/* Measurement container */}
      <div
        ref={measureRef}
        className={twMerge(
          className,
          // Place these CSS after className is important because we
          // need to make sure this is absoluted positioned and invisible
          'pointer-events-none invisible absolute'
        )}
      >
        {/**
         * The span is important because ellipsis component may not necessarily have
         * offsetWidth. (i.e. svg doesn't have offsetWidth)
         */}
        <span>
          {ellipsis?.([], [])} ?? <Ellipsis />
        </span>
        {children}
      </div>
    </>
  );
};
