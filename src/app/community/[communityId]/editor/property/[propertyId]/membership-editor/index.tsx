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
  fragment PropertyId_MembershipEditor on Property {
    id
    updatedAt
    updatedBy
    notes
    membershipList {
      year
      isMember
      eventAttendedList {
        eventName
        eventDate
      }
      paymentMethod
      paymentDeposited
    }
  }
`);

const PropertyMutation = graphql(/* GraphQL */ `
  mutation membershipModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_MembershipEditor
    }
  }
`);

interface Props {
  className?: string;
  entry: FragmentType<typeof EntryFragment>;
}

export const MembershipEditor: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);
  const [updateProperty] = useMutation(PropertyMutation);
  const { formMethods, disclosure } = useHookFormWithDisclosure(entry);
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
    <div className={props.className}>
      <FormProvider {...formMethods}>
        <Button
          size="sm"
          endContent={<Icon icon="edit" />}
          {...disclosure.getButtonProps()}
        >
          Edit Membership Info
        </Button>
        <ModalDialog
          entry={entry}
          disclosureProps={disclosure}
          onSave={onSave}
        />
      </FormProvider>
    </div>
  );
};
