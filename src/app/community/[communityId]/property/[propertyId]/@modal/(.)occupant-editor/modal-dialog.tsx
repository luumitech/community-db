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
  const occupantMethods = useFieldArray({
    control,
    name: 'occupantList',
  });

  const forceClose = React.useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          await onSave(input);
          forceClose();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSave, forceClose]
  );

  return (
    <Modal
      size="5xl"
      placement="top-center"
      isOpen
      onOpenChange={forceClose}
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
                  <Editor fieldArrayMethods={occupantMethods} />
                </ModalBody>
                <ModalFooter>
                  <Button
                    endContent={<Icon icon="person-add" />}
                    color="primary"
                    variant="bordered"
                    onPress={() => occupantMethods.append(occupantDefault)}
                  >
                    Add Contact
                  </Button>
                  <div className="flex-grow" />
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
