import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { IoPersonAdd } from 'react-icons/io5';
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
  const { control, formState, handleSubmit } = useHookFormContext();
  const { isOpen, onOpenChange, onClose } = disclosureProps;
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
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Edit Member Details
          </ModalHeader>
          <ModalBody>
            <Editor fieldArrayMethods={occupantMethods} />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              startContent={<IoPersonAdd />}
              onPress={() => occupantMethods.append(occupantDefault)}
            >
              Add Member
            </Button>
            <div className="flex-grow" />
            <Button color="danger" variant="flat" onPress={onClose}>
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
