import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { Modal, ModalContent } from '~/view/base/modal';
import { OccupancyEditor } from './occupancy-editor';
import { OccupancyEditorProvider } from './occupancy-editor-context';
import { InputData, useHookForm } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
  focusEmail?: string;
}

export const ModalDialog: React.FC<Props> = ({ onSave, focusEmail }) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const { formMethods } = useHookForm();
  const { control, formState, handleSubmit } = formMethods;
  const { isDirty } = formState;

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          await onSave(input);
          goBack();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSave, goBack]
  );

  return (
    <Modal
      size="5xl"
      isOpen
      onOpenChange={goBack}
      confirmation={isDirty}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(closeModal) => (
              <OccupancyEditorProvider
                control={control}
                focusEmail={focusEmail}
                closeModal={closeModal}
                isPending={pending}
              >
                <OccupancyEditor />
              </OccupancyEditorProvider>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
