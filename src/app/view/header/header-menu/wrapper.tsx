import React from 'react';
import { useMeasure, useWindowSize } from 'react-use';

interface Props {
  className?: string;
}

export const HeaderMenuWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  const { width: windowWidth } = useWindowSize();
  const [divRef, { width: menuWidth }] = useMeasure<HTMLDivElement>();
  const [leftPos, setLeftPos] = React.useState<number>();

  React.useEffect(() => {
    /**
     * We want the more menu to be render to the left of the avatar button, so
     * need to calculate the width of the more menu element to calculate the
     * left postion
     */
    const elem = document.getElementById('nav-bar-avatar');
    if (elem && menuWidth) {
      const rect = elem.getBoundingClientRect();
      setLeftPos(rect.right - menuWidth);
      // Update placeholder element width so rest of header bar would render correctly
      elem.style.width = `${menuWidth}px`;
    }
  }, [
    // we want to recalculate button position when screen size changes or
    // when the header menu width changes
    windowWidth,
    menuWidth,
  ]);

  return (
    <div
      className={className}
      // This prevents showing the menu, until it knows where to position it
      style={{ visibility: leftPos ? 'visible' : 'hidden' }}
    >
      <div
        ref={divRef}
        // Postion the menu to the left of avatar menu in header
        className="fixed top-3 z-50 flex items-center gap-2"
        style={{ left: leftPos }}
      >
        {children}
      </div>
    </div>
  );
};
