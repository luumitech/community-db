import { Button, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props {
  onOpen?: () => void;
}

export const DrawerButton: React.FC<Props> = ({ onOpen }) => {
  return (
    <Button onPress={onOpen} size="sm" variant="faded">
      <Icon icon="gridConfig" size={18} />
      Configure Widgets
    </Button>
  );
};
