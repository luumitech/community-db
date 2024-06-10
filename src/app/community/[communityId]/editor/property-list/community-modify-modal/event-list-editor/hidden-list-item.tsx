import { Spacer } from '@nextui-org/react';
import clsx from 'clsx';
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
    <li
      className={clsx(
        className,
        'flex items-center p-2 border-2 rounded-md min-w-[300px]'
      )}
    >
      {label}
      <Spacer className="grow" />
      <FlatButton icon="undo" onClick={() => onRemove?.(label)} />
    </li>
  );
};
