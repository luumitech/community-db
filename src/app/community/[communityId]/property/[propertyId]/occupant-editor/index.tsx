import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/react';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';
import { ModalDialog } from './modal-dialog';
import { InputData, useHookFormWithDisclosure } from './use-hook-form';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupantEditor on Property {
    id
    updatedAt
    updatedBy {
      ...User
    }
    occupantList {
      firstName
      lastName
      optOut
      email
      cell
      work
      home
    }
  }
`);

const OccupantMutation = graphql(/* GraphQL */ `
  mutation occupantModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_OccupantEditor
    }
  }
`);

interface Props {
  className?: string;
  entry: FragmentType<typeof EntryFragment>;
}

export const OccupantEditor: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);
  const { formMethods, disclosure } = useHookFormWithDisclosure(entry);
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
    <div className={props.className}>
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
