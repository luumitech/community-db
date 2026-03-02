import { Button } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { Wizard } from '../wizard';

interface Props {
  className?: string;
}

export const SignInEmailOtp: React.FC<Props> = ({ className }) => {
  const { goTo } = Wizard.useWizard();

  return (
    <Button
      className={className}
      startContent={<Icon icon="email" size={24} />}
      variant="bordered"
      onPress={() => goTo('sendEmailOTP', {})}
    >
      Continue with Email
    </Button>
  );
};
