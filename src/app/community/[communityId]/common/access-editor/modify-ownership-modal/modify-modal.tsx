import { UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Modal } from '~/view/base/modal';
import { OwnerSelect } from './owner-select';
import {
  InputData,
  useHookForm,
  type ModifyFragmentType,
} from './use-hook-form';

export interface ModalArg {
  community: ModifyFragmentType;
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
  const { formMethods, community } = useHookForm(fragment);
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

  /**
   * TODO: If billing is active, changing ownership also means subscription
   * level for the database may be changing
   */
  return (
    <Modal
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      confirmation={isDirty}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content>
            {(closeModal) => (
              <>
                <Modal.Header>Modify Ownership</Modal.Header>
                <Modal.Body>
                  <OwnerSelect controlName="ownerId" community={community} />
                </Modal.Body>
                <Modal.Footer>
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
                </Modal.Footer>
              </>
            )}
          </Modal.Content>
        </Form>
      </FormProvider>
    </Modal>
  );
};
