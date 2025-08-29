import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { AddressEditor } from '~/community/[communityId]/common/address-editor';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appLabel } from '~/lib/app-path';
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
  useHookForm,
  type CreateFragmentType,
  type InputData,
} from './use-hook-form';

export interface ModalArg {
  community: CreateFragmentType;
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const CreateModal: React.FC<Props> = ({
  community: fragment,
  disclosure,
  onSave,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { community, formMethods } = useHookForm(fragment);
  const { handleSubmit, formState } = formMethods;
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
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      confirmation={isDirty}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader>{appLabel('propertyCreate')}</ModalHeader>
                <ModalBody>
                  <AddressEditor forceCloseModal={onClose} />
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="bordered"
                    isDisabled={pending}
                    onPress={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isDisabled={!formState.isDirty}
                    isLoading={pending}
                  >
                    Create
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
