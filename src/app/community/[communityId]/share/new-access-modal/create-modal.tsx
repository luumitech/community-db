import { UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { EmailEditor } from './email-editor';
import { RoleEditor } from './role-editor';
import { InputData, useHookFormContext } from './use-hook-form';

interface Props {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const CreateModal: React.FC<Props> = ({ disclosure, onSave }) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formState, handleSubmit } = useHookFormContext();
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
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      confirmation={isDirty}
      placement="top-center"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader>Add User To Access List</ModalHeader>
              <ModalBody>
                <EmailEditor />
                <RoleEditor />
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isDisabled={!formState.isDirty || pending}
                >
                  Share
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Form>
    </Modal>
  );
};
