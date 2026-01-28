import { useSize } from 'ahooks';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { Ellipsis } from './ellipsis';

export { Ellipsis } from './ellipsis';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

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
  const ellipsisMeasureRef = React.useRef<HTMLDivElement | null>(null);
  const ellipsisSz = useSize(ellipsisMeasureRef);
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
      ellipsis.style.display = 'none';
      childElemList.forEach((el) => {
        el.style.display = '';
      });

      const containerRect = container.getBoundingClientRect();

      /**
       * If this is a flex container, find the gap, so we can use it when
       * measuring ellipsis width
       */
      const containerStyle = getComputedStyle(container);
      const gap = parseFloat(containerStyle.columnGap);

      let firstHiddenIndex: number | null = null;

      for (let i = 0; i < childElemList.length; i++) {
        const childRect = childElemList[i].getBoundingClientRect();

        // ellipsis is not shown for last children element
        const ellipsisWidth =
          i === childElemList.length - 1 ? 0 : gap + ellipsisSz.width;

        if (childRect.right + ellipsisWidth > containerRect.right) {
          firstHiddenIndex = i;
          break;
        }
      }

      if (firstHiddenIndex !== null) {
        setVisibleCount(firstHiddenIndex);
        for (let i = firstHiddenIndex; i < childElemList.length; i++) {
          childElemList[i].style.display = 'none';
        }
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
        className="pointer-events-none invisible absolute"
      >
        {renderEllipsis?.([], []) ?? <Ellipsis />}
      </span>
    </div>
  );
};
