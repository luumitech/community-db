import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/react';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';
import { type PropertyEntry } from '../_type';
import { ModalDialog } from './modal-dialog';
import { InputData, useHookFormWithDisclosure } from './use-hook-form';

const OccupantMutation = graphql(/* GraphQL */ `
  mutation occupantModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_OccupantEditor
    }
  }
`);

interface Props {
  className?: string;
  fragment: PropertyEntry;
}

export const OccupantEditor: React.FC<Props> = ({ className, fragment }) => {
  const { formMethods, disclosure } = useHookFormWithDisclosure(fragment);
  const { formState } = formMethods;
  const [updateProperty] = useMutation(OccupantMutation);

  const onSave = async (input: InputData) => {
    if (!formState.isDirty) {
      return;
    }
    await toast.promise(
      updateProperty({
        variables: { input },
      }),
      {
        pending: 'Saving...',
        success: 'Saved',
      }
    );
  };

  return (
    <div className={className}>
      <FormProvider {...formMethods}>
        <Button
          size="sm"
          endContent={<Icon icon="edit" />}
          {...disclosure.getButtonProps()}
        >
          Edit Member Details
        </Button>
        <ModalDialog disclosureProps={disclosure} onSave={onSave} />
      </FormProvider>
    </div>
  );
};
