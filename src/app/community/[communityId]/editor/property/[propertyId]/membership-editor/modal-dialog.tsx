import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Button } from '~/view/base/button';
import { MembershipInfoEditor } from './membership-info-editor';
import { NotesEditor } from './notes-editor';
import { InputData, useHookFormContext } from './use-hook-form';

interface Props {
  entry: GQL.PropertyId_MembershipEditorFragment;
  disclosureProps: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
  /**
   * onSave is in progress
   */
  isSaving?: boolean;
}

export const ModalDialog: React.FC<Props> = ({
  entry,
  disclosureProps,
  onSave,
  isSaving,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosureProps;
  const { formState, handleSubmit } = useHookFormContext();
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) => {
      await onSave(input);
      onClose?.();
    },
    [onSave, onClose]
  );

  return (
    <Modal
      size="5xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Edit Membership</ModalHeader>
          <ModalBody>
            <NotesEditor />
            <MembershipInfoEditor />
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" confirmation={isDirty} onPress={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isDisabled={!formState.isDirty}
              isLoading={isSaving}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
