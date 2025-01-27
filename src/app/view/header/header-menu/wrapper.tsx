import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useResizeObserver, useWindowSize } from 'usehooks-ts';

interface Props {
  className?: string;
}

export const HeaderMenuWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  const { status } = useSession();
  const { width: windowWidth } = useWindowSize();
  const divRef = React.useRef<HTMLDivElement>(null);
  const { width: menuWidth } = useResizeObserver({ ref: divRef });
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
    }
  }, [
    // we want to recalculate button position when screen size changes or
    // when the header menu width changes
    windowWidth,
    menuWidth,
  ]);

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div
      className={className}
      // This prevents showing the menu, until it knows where to position it
      style={{ visibility: leftPos ? 'visible' : 'hidden' }}
    >
      <div
        ref={divRef}
        // Postion the menu to the left of avatar menu in header
        className="fixed z-50 flex gap-2 items-center top-3"
        style={{ left: leftPos }}
      >
        {children}
      </div>
    </div>
  );
};
