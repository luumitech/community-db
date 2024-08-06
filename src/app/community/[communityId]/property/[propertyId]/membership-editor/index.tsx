import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';
import { PropertyEntry } from '../_type';
import { ModalDialog } from './modal-dialog';
import { InputData, useHookFormWithDisclosure } from './use-hook-form';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation membershipModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_MembershipEditor
    }
  }
`);

interface Props {
  className?: string;
  fragment: PropertyEntry;
}

export const MembershipEditor: React.FC<Props> = ({ className, fragment }) => {
  const { communityUi } = useAppContext();
  const { yearSelected } = communityUi;
  const [updateProperty] = useMutation(PropertyMutation);
  const { formMethods, disclosure } = useHookFormWithDisclosure(
    fragment,
    yearSelected
  );
  const { formState } = formMethods;
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
          Edit Membership Info
        </Button>
        <ModalDialog
          fragment={fragment}
          disclosureProps={disclosure}
          onSave={onSave}
        />
      </FormProvider>
    </div>
  );
};
