import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
}

export const HeaderMenuWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div className={className}>
      <div
        // Postion the menu to the left of avatar menu in header
        className="fixed z-50 flex gap-2 items-center top-3 right-[80px]"
      >
        {children}
      </div>
    </div>
  );
};
