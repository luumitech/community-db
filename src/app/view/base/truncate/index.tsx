import React from 'react';
import { useMeasure } from 'react-use';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { parseAsNumber } from '~/lib/number-util';
import { Ellipsis } from './ellipsis';

export { Ellipsis } from './ellipsis';

type DivProps = React.ComponentProps<'div'>;

export interface TruncateProps extends DivProps {
  className?: string;
  /**
   * Customize ellipsis element to render
   *
   * @param hidden List of items not shown on screen
   * @param visible List of visible items shown on screen
   */
  renderEllipsis?: (
    hidden: React.ReactNode[],
    visible: React.ReactNode[]
  ) => React.ReactNode;
}

export const Truncate: React.FC<TruncateProps> = ({
  className,
  renderEllipsis,
  children,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const childRefs = React.useRef<HTMLDivElement[]>([]);
  const ellipsisRef = React.useRef<HTMLDivElement | null>(null);
  const [ellipsisMeasureRef, ellipsisSz] = useMeasure<HTMLDivElement>();
  const [visibleCount, setVisibleCount] = React.useState<number>();

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const ellipsis = ellipsisRef.current;
    if (!container || !ellipsis || ellipsisSz == null) {
      return;
    }

    const childElemList = childRefs.current;

    /**
     * Look at the layout of the children element, and only show those that have
     * not been clipped by the container. And show the ellipsis component if
     * some children have been hidden by this logic.
     */
    const update = () => {
      // Before measuring, show all children and hide the ellipsis
      ellipsis.style.display = 'none';
      childElemList.forEach((el) => {
        el.style.display = '';
      });

      /**
       * Measure the container width after forcing all child elements to be
       * visible.
       */
      const containerRect = container.getBoundingClientRect();

      /**
       * If this is a flex container, find the gap, so we can use it when
       * measuring ellipsis width
       */
      const containerStyle = getComputedStyle(container);
      const gap =
        parseAsNumber(containerStyle.columnGap, { lenient: true }) ?? 0;

      let firstHiddenIndex: number | null = null;

      /**
       * It's possible that some elements within childElemList may have zero
       * width, so we must iterate through the entire list and find ones with
       * positive width.
       *
       * Then we can deterimine if we need to add ellipsis by calculating if the
       * child element(s) fit inside the container width
       */
      const childRectList = childElemList
        .map((elem, idx) => ({
          elemIdx: idx,
          rect: elem.getBoundingClientRect(),
        }))
        .filter(({ rect }) => rect.width > 0);

      for (let i = 0; i < childRectList.length; i++) {
        const childRect = childRectList[i].rect;

        // ellipsis is not shown for last element
        const ellipsisWidth =
          i === childRectList.length - 1 ? 0 : gap + ellipsisSz.width;

        if (childRect.right + ellipsisWidth > containerRect.right) {
          firstHiddenIndex = childRectList[i].elemIdx;
          break;
        }
      }

      if (firstHiddenIndex !== null) {
        setVisibleCount(firstHiddenIndex);
        for (let i = firstHiddenIndex; i < childElemList.length; i++) {
          childElemList[i].style.display = 'none';
        }
        // Show the ellipsis
        ellipsis.style.display = '';
      } else {
        setVisibleCount(childElemList.length);
      }
    };

    const observer = new ResizeObserver(update);
    observer.observe(container);
    update();

    return () => observer.disconnect();
  }, [children, ellipsisSz]);

  const [visibleList, hiddenList] = React.useMemo(() => {
    const childCount = React.Children.toArray(children).length;
    return R.partition(
      React.Children.toArray(children),
      (elem, idx) => idx < (visibleCount ?? childCount)
    );
  }, [children, visibleCount]);

  return (
    <div
      ref={containerRef}
      className={twMerge('overflow-hidden', className)}
      {...props}
    >
      {React.Children.toArray(children).map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) {
              childRefs.current[i] = el;
            }
          }}
          className="flex-none"
        >
          {child}
        </div>
      ))}
      <span ref={ellipsisRef}>
        {renderEllipsis?.(hiddenList, visibleList) ?? <Ellipsis />}
      </span>
      {/** For measuring the size of the ellipsis component */}
      <span
        ref={ellipsisMeasureRef}
        className="pointer-events-none invisible absolute start-0"
      >
        {renderEllipsis?.([], []) ?? <Ellipsis />}
      </span>
    </div>
  );
};
