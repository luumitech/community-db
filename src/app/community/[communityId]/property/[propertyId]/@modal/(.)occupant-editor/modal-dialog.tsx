import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider, useFieldArray } from '~/custom-hooks/hook-form';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Icon } from '~/view/base/icon';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { Editor } from './editor';
import { InputData, occupantDefault, useHookForm } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ onSave }) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const { formMethods } = useHookForm();
  const { control, formState, handleSubmit } = formMethods;
  const { isDirty } = formState;
  const occupantListMethods = useFieldArray({
    control,
    name: 'occupantList',
  });

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
                <ModalHeader>{appLabel('occupantEditor')}</ModalHeader>
                <ModalBody>
                  <Editor occupantListMethods={occupantListMethods} />
                </ModalBody>
                <ModalFooter>
                  <Button
                    endContent={<Icon icon="person-add" />}
                    color="primary"
                    variant="bordered"
                    onPress={() => occupantListMethods.append(occupantDefault)}
                  >
                    Add Contact
                  </Button>
                  <div className="grow" />
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
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
