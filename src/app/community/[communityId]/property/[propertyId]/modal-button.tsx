import { Button, ButtonProps } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props extends ButtonProps {
  className?: string;
}

export const ModalButton: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div>
      <Button
        className={clsx(className)}
        size="sm"
        endContent={<Icon icon="edit" />}
        {...props}
      />
    </div>
  );
};
