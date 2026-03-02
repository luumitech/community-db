import { Button } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { type WizardContext } from '..';

interface Props {
  context: WizardContext;
}

export const Step1Footer: React.FC<Props> = ({ context }) => {
  const { goBack } = context;

  return (
    <>
      <Button
        startContent={<Icon icon="back" />}
        onPress={goBack}
        color="primary"
      >
        Back
      </Button>
    </>
  );
};
