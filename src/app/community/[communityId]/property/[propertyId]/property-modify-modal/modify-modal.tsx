import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import React from 'react';
import { AddressEditorForm } from '~/community/[communityId]/common/address-editor-form';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { LastModified } from '~/view/last-modified';
import { usePageContext } from '../page-context';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({ onSave }) => {
  const { propertyModify } = usePageContext();
  const { disclosure, property } = propertyModify;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formState, handleSubmit } = useHookFormContext();
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          await onSave(input);
          onClose?.();
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
      placement="top-center"
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Edit Property</ModalHeader>
          <ModalBody>
            <AddressEditorForm />
          </ModalBody>
          <ModalFooter className="flex items-center justify-between">
            <LastModified
              className="text-right"
              updatedAt={property.updatedAt}
              updatedBy={property.updatedBy}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="bordered"
                confirmation={isDirty}
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                isDisabled={!formState.isDirty || pending}
              >
                Save
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};
