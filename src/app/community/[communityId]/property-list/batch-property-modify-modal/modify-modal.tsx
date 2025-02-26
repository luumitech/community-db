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
import { FilterSelect } from './filter-select';
import { MembershipInfoEditor } from './membership-info-editor';
import {
  InputData,
  useHookFormContext,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({ hookForm, onSave }) => {
  const { disclosure } = hookForm;
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
              <ModalHeader>Batch Property Modify</ModalHeader>
              <ModalBody>
                <FilterSelect className="mb-4" />
                <MembershipInfoEditor />
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
