import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
}

export const HeaderMenuWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [leftPos, setLeftPos] = React.useState<number>();

  React.useEffect(() => {
    /**
     * We want the more menu to be render to the left of the avatar button, so
     * need to calculate the width of the more menu element to calculate the
     * left postion
     */
    const elem = document.getElementById('nav-bar-avatar');
    const divWidth = divRef.current?.offsetWidth;
    if (elem && divWidth) {
      const rect = elem.getBoundingClientRect();
      setLeftPos(rect.right - divWidth);
    }
  }, []);

  return (
    <div className={className}>
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
