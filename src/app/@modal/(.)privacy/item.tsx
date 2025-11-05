import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {
  className?: string;
  title: React.ReactNode;
  /** Optional anchor ID for the bullet element */
  anchorId?: string;
}

export const Item: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  title,
  anchorId,
  children,
}) => {
  const pathname = usePathname();
  const ref = React.useRef<HTMLDivElement>(null);

  /** This allows hash on URL to control scrolling the item into view */
  React.useEffect(() => {
    if (anchorId && window.location.hash === `#${anchorId}`) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [anchorId, pathname]);

  return (
    <div ref={ref} className={className} id={anchorId}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  );
};
