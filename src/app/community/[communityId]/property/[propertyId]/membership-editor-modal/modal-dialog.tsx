import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { NotesEditor } from '~/community/[communityId]/common/notes-editor';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { LastModified } from '~/view/last-modified';
import { MembershipInfoEditor } from './membership-info-editor';
import { InputData, useHookForm } from './use-hook-form';

export interface ModalArg {}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ disclosure, onSave }) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formMethods, property } = useHookForm();
  const { formState, handleSubmit } = formMethods;
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          await onSave(input);
          onClose();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSave, onClose]
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
                <ModalHeader>{appLabel('membershipEditor')}</ModalHeader>
                <ModalBody className="gap-4">
                  <MembershipInfoEditor property={property} />
                  <NotesEditor controlName="notes" />
                </ModalBody>
                <ModalFooter className="flex items-center justify-between">
                  <LastModified
                    updatedAt={property.updatedAt}
                    updatedBy={property.updatedBy}
                  />
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
                      isDisabled={!formState.isDirty}
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
