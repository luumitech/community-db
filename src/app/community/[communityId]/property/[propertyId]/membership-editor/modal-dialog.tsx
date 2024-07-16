import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { Button } from '~/view/base/button';
import { PropertyEntry } from '../_type';
import { MembershipInfoEditor } from './membership-info-editor';
import { NotesEditor } from './notes-editor';
import { InputData, useHookFormContext } from './use-hook-form';

interface Props {
  fragment: PropertyEntry;
  disclosureProps: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({
  fragment,
  disclosureProps,
  onSave,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosureProps;
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Edit Membership Info</ModalHeader>
          <ModalBody>
            <MembershipInfoEditor />
            <NotesEditor />
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" confirmation={isDirty} onPress={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isDisabled={!formState.isDirty || pending}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
