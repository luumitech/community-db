import { Button, Tooltip } from '@heroui/react';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import { Icon } from '~/view/base/icon';
import { MembershipInfoEditor } from '../membership-info-editor';
import { useHookFormContext } from '../use-hook-form';
import { StepTemplate } from './step-template';

interface Props {
  isSubmitting?: boolean;
  closeModal: () => void;
}

export const Step2: React.FC<Props> = (props) => {
  return (
    <StepTemplate body={<Body {...props} />} footer={<Footer {...props} />} />
  );
};

const Body: React.FC<Props> = ({}) => {
  const { previousStep } = useWizard();

  return <MembershipInfoEditor />;
};

const Footer: React.FC<Props> = ({ isSubmitting, closeModal }) => {
  const { previousStep } = useWizard();
  const { formState } = useHookFormContext();

  return (
    <>
      <Button
        variant="ghost"
        onPress={previousStep}
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
