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
import { FilterSelect } from './filter-select';
import { MembershipInfoEditor } from './membership-info-editor';
import {
  InputData,
  useHookForm,
  type BatchPropertyModifyFragmentType,
} from './use-hook-form';

export interface ModalArg {
  community: BatchPropertyModifyFragmentType;
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
      <FormProvider {...formMethods}>
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
