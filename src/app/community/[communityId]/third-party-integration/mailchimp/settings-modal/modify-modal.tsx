import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { ApiKey } from './api-key';
import {
  useHookForm,
  type InputData,
  type ModifyFragmentType,
} from './use-hook-form';

export interface ModalArg {
  community: ModifyFragmentType;
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({
  community: fragment,
  disclosure,
  onSave,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formMethods } = useHookForm(fragment);
  const { formState, handleSubmit } = formMethods;
  const { isDirty, dirtyFields } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          if (!dirtyFields.mailchimpSetting?.apiKey) {
            /**
             * The API key is not exposed to client in plaintext (It has been
             * obfuscated by the server). So unless it has been changed
             * explicitly by the user, don't write the API key back to the
             * server.
             */
            // @ts-expect-error It's okay to ignore this error
            delete input.mailchimpSetting.apiKey;
          }
          await onSave(input);
          onClose();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSave, onClose, dirtyFields]
  );

  return (
    <Modal
      size="5xl"
      placement="top-center"
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
                <ModalHeader className="flex justify-between">
                  Mailchimp Integration Settings
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <p className="text-foreground-500 text-sm">
                      Adding a Mailchimp API key enables synchronization between
                      the Mailchimp audience list and the community contact
                      list.
                    </p>
                    <ApiKey />
                  </div>
                </ModalBody>
                <ModalFooter className="flex items-center">
                  <div className="flex items-center gap-2">
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
                      isDisabled={!isDirty}
                      isLoading={pending}
                    >
                      Save
                    </Button>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
