import { ApolloError } from '@apollo/client';
import { UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appTitle } from '~/lib/env';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import type { AudienceMember } from '../_type';
import { EmailEditor } from './email-editor';
import { FullNameEditor } from './full-name-editor';
import { extractMailchimpError } from './mailchimp-error-handler';
import { StatusEditor } from './status-editor';
import {
  InputData,
  useHookForm,
  type ModifyFragmentType,
} from './use-hook-form';

export interface ModalArg {
  audienceListId: string;
  member: ModifyFragmentType & AudienceMember;
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({
  audienceListId,
  member: fragment,
  disclosure,
  onSave,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formMethods, member } = useHookForm(audienceListId, fragment);
  const { formState, handleSubmit, setError } = formMethods;
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          await onSave(input);
          onClose();
        } catch (err) {
          if (err instanceof ApolloError) {
            const [handledByForm] = extractMailchimpError(err);
            handledByForm.forEach(({ field, message }) => {
              switch (field) {
                case 'email address':
                  setError('email_address', { type: 'custom', message });
                  break;
              }
            });
          }
        }
      }),
    [onSave, onClose, setError]
  );

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      confirmation={isDirty}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader className="flex flex-col">
                  Modify Mailchimp Contact
                  <div className="text-xs font-normal text-default-400">
                    This changes information in Mailchimp only. To update
                    contact information in the {appTitle}, please locate the
                    occupant’s property and update the contact details there.
                  </div>
                </ModalHeader>
                <ModalBody>
                  <EmailEditor />
                  <FullNameEditor />
                  <StatusEditor />
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="bordered"
                    isDisabled={pending}
                    onPress={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    isDisabled={!formState.isDirty}
                    isLoading={pending}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
