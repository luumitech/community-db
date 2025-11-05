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
    <div className={className}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  );
};
