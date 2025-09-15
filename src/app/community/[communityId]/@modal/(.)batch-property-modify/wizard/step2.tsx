import { Button } from '@heroui/react';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { GpsInputEditor } from '../gps-input-editor';
import { MembershipInfoEditor } from '../membership-info-editor';
import { useHookFormContext } from '../use-hook-form';
import { StepTemplate } from './step-template';

interface Props {
  isSubmitting?: boolean;
  closeModal: () => void;
}

export const Step2: React.FC<Props> = (props) => {
  const { watch } = useHookFormContext();
  const method = watch('method');

  const body = React.useMemo(() => {
    switch (method) {
      case GQL.BatchModifyMethod.AddEvent:
        return <AddEventBody {...props} />;

      case GQL.BatchModifyMethod.AddGps:
        return <AddGpsBody {...props} />;

      default:
        throw new Error('Unsupported method');
    }
  }, [method, props]);

  return <StepTemplate body={body} footer={<Footer {...props} />} />;
};

const AddEventBody: React.FC<Props> = ({}) => {
  const { previousStep } = useWizard();

  return <MembershipInfoEditor />;
};

const AddGpsBody: React.FC<Props> = ({}) => {
  const { previousStep } = useWizard();

  return <GpsInputEditor />;
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
