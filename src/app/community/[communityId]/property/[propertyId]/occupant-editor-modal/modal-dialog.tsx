import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider, useFieldArray } from '~/custom-hooks/hook-form';
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

export interface ModalArg {}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ disclosure, onSave }) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formMethods } = useHookForm();
  const { control, formState, handleSubmit } = formMethods;
  const { isDirty } = formState;
  const occupantMethods = useFieldArray({
    control,
    name: 'occupantList',
  });

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
                <ModalHeader>Membership Contact Information</ModalHeader>
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
