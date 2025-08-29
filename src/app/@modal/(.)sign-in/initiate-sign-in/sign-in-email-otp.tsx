import { Button } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { usePanelContext } from '../panel-context';

interface Props {
  className?: string;
}

export const SignInEmailOtp: React.FC<Props> = ({ className }) => {
  const { goToPanel } = usePanelContext();

  return (
    <Button
      className={className}
      startContent={<Icon icon="email" size={24} />}
      variant="bordered"
      onPress={() => goToPanel('send-email-otp', {})}
    >
      Continue with Email
    </Button>
  );
};
