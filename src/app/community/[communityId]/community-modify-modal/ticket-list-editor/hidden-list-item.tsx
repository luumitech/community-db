import { cn } from '@heroui/react';
import React from 'react';
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
      className={cn(
        className,
        'grid col-span-full grid-cols-subgrid',
        'mx-3 items-center h-6'
      )}
      role="row"
    >
      <div />
      <span className="line-through text-sm">{label}</span>
      <div />
      <div />
      <FlatButton icon="undo" onClick={() => onRemove?.(label)} />
    </div>
  );
};
