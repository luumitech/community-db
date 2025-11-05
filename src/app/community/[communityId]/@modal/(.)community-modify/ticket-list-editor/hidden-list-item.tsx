import React from 'react';
import { twMerge } from 'tailwind-merge';
import { FlatButton } from '~/view/base/flat-button';

interface Props {
  className?: string;
  id: string;
  label: string;
  onRemove?: (label: string) => void;
}

export const HiddenListItem: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  id,
  label,
  onRemove,
}) => {
  return (
    <div
      className={twMerge(
        'col-span-full grid grid-cols-subgrid',
        'mx-3 h-6 items-center',
        className
      )}
      role="row"
    >
      <div />
      <span className="text-sm line-through">{label}</span>
      <div />
      <div />
      <FlatButton icon="undo" onClick={() => onRemove?.(label)} />
    </div>
  );
};
