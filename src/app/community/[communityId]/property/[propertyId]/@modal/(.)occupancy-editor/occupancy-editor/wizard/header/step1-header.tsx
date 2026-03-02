import { Button } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { type WizardContext } from '..';

interface Props {
  context: WizardContext;
}

export const Step1Header: React.FC<Props> = ({ context }) => {
  const { goBack } = context;

  return (
    <div className="flex items-center gap-2">
      <Button
        startContent={<Icon icon="back" />}
        variant="ghost"
        isIconOnly
        onPress={goBack}
      />
      Household Management
    </div>
  );
};
