import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModalDialog } from './modal-dialog';
import { type InputData } from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

const RegisterEventMutation = graphql(/* GraphQL */ `
  mutation registerEvent($input: RegisterEventInput!) {
    registerEvent(input: $input) {
      # Modifying membership may change minYear/maxYear
      community {
        id
        minYear
        maxYear
      }
      property {
        ...PropertyId_MembershipEditor
      }
    }
  }
`);

interface Props {
  className?: string;
}

export const RegisterEventModal: React.FC<Props> = ({ className }) => {
  const [updateProperty] = useMutation(RegisterEventMutation);
  const { registerEvent } = usePageContext();
  const { formMethods } = registerEvent;

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { hidden, ...input } = _input;
      await toast.promise(updateProperty({ variables: { input } }), {
        pending: 'Saving...',
        // success: 'Saved',
      });
    },
    [updateProperty]
  );

  return (
    <div className={className}>
      <FormProvider {...formMethods}>
        <ModalDialog onSave={onSave} />
      </FormProvider>
    </div>
  );
};
