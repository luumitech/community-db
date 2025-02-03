import { Button, ButtonProps, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props extends ButtonProps {
  className?: string;
}

export const ModalButton: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div>
      <Button
        className={cn(className)}
        size="sm"
        endContent={<Icon icon="edit" />}
        {...props}
      />
    </div>
  );
};
