import React from 'react';
import { AddressEditorForm } from '~/community/[communityId]/common/address-editor-form';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import {
  useHookFormContext,
  type InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
  onSave: (input: InputData) => Promise<void>;
}

export const CreateModal: React.FC<Props> = ({ hookForm, onSave }) => {
  const { disclosure } = hookForm;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { handleSubmit, formState } = useHookFormContext();

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
      placement="top-center"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader>Create Property</ModalHeader>
              <ModalBody>
                <AddressEditorForm />
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={closeModal}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isDisabled={!formState.isDirty || pending}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Form>
    </Modal>
  );
};
