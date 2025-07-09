import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { Wizard } from 'react-use-wizard';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appLabel } from '~/lib/app-path';
import { Form } from '~/view/base/form';
import { Modal, ModalContent, ModalHeader } from '~/view/base/modal';
import {
  InputData,
  useHookForm,
  type BatchPropertyModifyFragmentType,
} from './use-hook-form';
import { Step0, Step1, Step2 } from './wizard';

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
                <ModalHeader>{appLabel('batchPropertyModify')}</ModalHeader>
                <Wizard>
                  <Step0 />
                  <Step1 />
                  <Step2 isSubmitting={pending} closeModal={closeModal} />
                </Wizard>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
