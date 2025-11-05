import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}
export const RowHeader: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'col-span-full grid grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'items-center font-semibold text-tiny',
        'rounded-lg px-3',
        className
      )}
      role="row"
    >
      <div role="columnheader" aria-label="Reorder handle" />
      <div role="columnheader">Payment Method</div>
      <div role="columnheader" />
    </div>
  );
};
