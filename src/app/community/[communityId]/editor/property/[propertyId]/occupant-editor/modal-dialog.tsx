import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { IoPersonAdd } from 'react-icons/io5';
import { Button } from '~/view/base/button';
import { Editor } from './editor';
import {
  InputData,
  occupantDefault,
  useFieldArray,
  useHookFormContext,
} from './use-hook-form';

interface Props {
  disclosureProps: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
  /**
   * onSave is in progress
   */
  isSaving?: boolean;
}

export const ModalDialog: React.FC<Props> = ({
  disclosureProps,
  onSave,
  isSaving,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosureProps;
  const { control, formState, handleSubmit } = useHookFormContext();
  const { isDirty } = formState;
  const occupantMethods = useFieldArray({
    control,
    name: 'occupantList',
  });

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
          <ModalHeader>Edit Member Details</ModalHeader>
          <ModalBody>
            <Editor fieldArrayMethods={occupantMethods} />
          </ModalBody>
          <ModalFooter>
            <Button
              endContent={<IoPersonAdd />}
              onPress={() => occupantMethods.append(occupantDefault)}
            >
              Add Member
            </Button>
            <div className="flex-grow" />
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
