import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
}
export const RowHeader: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={clsx(
        className,
        'grid col-span-full grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'text-tiny font-semibold items-center',
        'rounded-lg px-3'
      )}
      role="row"
    >
      <div role="columnheader" aria-label="Reorder handle" />
      <div role="columnheader">Payment Method</div>
      <div role="columnheader" />
    </div>
  );
};
