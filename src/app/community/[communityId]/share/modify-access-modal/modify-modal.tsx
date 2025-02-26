import { UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { getFragment } from '~/graphql/generated';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import type { AccessEntry } from '../_type';
import { RoleEditor } from './role-editor';
import { InputData, ModifyFragment, useHookFormContext } from './use-hook-form';

interface Props {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
  fragment: AccessEntry;
}

export const ModifyModal: React.FC<Props> = ({
  disclosure,
  onSave,
  fragment,
}) => {
  const access = getFragment(ModifyFragment, fragment);
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
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader>Modify Access for {access.user.email}</ModalHeader>
              <ModalBody>
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
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Form>
    </Modal>
  );
};
