import { useRouter } from 'next/navigation';
import React from 'react';
import { Wizard } from 'react-use-wizard';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appLabel } from '~/lib/app-path';
import { Form } from '~/view/base/form';
import { Modal, ModalContent, ModalHeader } from '~/view/base/modal';
import { useLayoutContext } from '../../layout-context';
import { InputData, useHookForm } from './use-hook-form';
import { Header, Step0, Step1, Step2 } from './wizard';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({ onSave }) => {
  const router = useRouter();
  const { community } = useLayoutContext();
  const [pending, startTransition] = React.useTransition();
  const { formMethods } = useHookForm(community);
  const { formState, handleSubmit } = formMethods;
  const { isDirty, errors } = formState;

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
      placement="top-center"
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
              <>
                <ModalHeader>{appLabel('batchPropertyModify')}</ModalHeader>
                <Wizard header={<Header />}>
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
