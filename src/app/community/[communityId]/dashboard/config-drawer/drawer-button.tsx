import { Button, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props {
  onOpen?: () => void;
}

export const DrawerButton: React.FC<Props> = ({ onOpen }) => {
  return (
    <Button
      className={cn(
        'fixed top-32 left-0 z-50',
        'rounded-l-none',
        // Reveal button on hover
        'transition-transform duration-300',
        '-translate-x-9 hover:translate-x-0',
        '[&>svg]:transition-transform [&>svg]:duration-500',
        '[&>svg]:translate-x-2.5 hover:[&>svg]:translate-x-0 hover:[&>svg]:rotate-180',
        // For touch device, always shows the button
        'touch:-translate-x-4.5 touch:[&>svg]:translate-x-2 touch:[&>svg]:rotate-180'
      )}
      onPress={onOpen}
      isIconOnly
      size="lg"
      variant="faded"
    >
      <Icon icon="settings" size={24} />
    </Button>
  );
};
