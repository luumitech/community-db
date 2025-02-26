import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
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
import { usePageContext } from '../page-context';
import { Editor } from './editor';
import {
  InputData,
  occupantDefault,
  useHookFormContext,
} from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ onSave }) => {
  const { occupantEditor } = usePageContext();
  const { disclosure } = occupantEditor;
  const { isOpen, onOpenChange, onClose } = disclosure;
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
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      confirmation={isDirty}
      placement="top-center"
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
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
                <Button variant="bordered" onPress={closeModal}>
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
            </>
          )}
        </ModalContent>
      </Form>
    </Modal>
  );
};
