import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { Editor } from './editor';
import {
  InputData,
  occupantDefault,
  useHookFormContext,
} from './use-hook-form';

interface Props {
  disclosureProps: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ disclosureProps, onSave }) => {
  const { isOpen, onOpenChange, onClose } = disclosureProps;
  const [pending, startTransition] = React.useTransition();
  const { control, formState, handleSubmit } = useHookFormContext();

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
          <ModalHeader>Edit Member Details</ModalHeader>
          <ModalBody>
            <Editor fieldArrayMethods={occupantMethods} />
          </ModalBody>
          <ModalFooter>
            <Button
              endContent={<Icon icon="person-add" />}
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
