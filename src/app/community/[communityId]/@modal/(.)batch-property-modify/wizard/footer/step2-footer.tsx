import React from 'react';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { type WizardContext } from '..';
import { useHookFormContext } from '../../use-hook-form';

interface Props {
  context: WizardContext;
  isSubmitting?: boolean;
  closeModal: () => void;
}

export const Step2Footer: React.FC<Props> = ({
  context,
  isSubmitting,
  closeModal,
}) => {
  const { formState } = useHookFormContext();
  const { goPrev } = context;

  return (
    <>
      <Button
        variant="ghost"
        onPress={goPrev}
        startContent={<Icon className="rotate-180" icon="chevron-forward" />}
      >
        Prev
      </Button>
      <Button variant="bordered" isDisabled={isSubmitting} onPress={closeModal}>
        Cancel
      </Button>
      <Button
        type="submit"
        color="primary"
        isDisabled={!formState.isDirty}
        isLoading={isSubmitting}
      >
        Save
      </Button>
    </>
  );
};
