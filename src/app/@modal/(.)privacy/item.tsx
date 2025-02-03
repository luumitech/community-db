import { cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
  title: React.ReactNode;
}

export const Item: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  title,
  children,
}) => {
  return (
    <div className={cn(className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm mt-2">{children}</p>
    </div>
  );
};
