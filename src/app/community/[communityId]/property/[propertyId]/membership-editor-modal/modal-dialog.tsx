import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import React from 'react';
import { NotesEditor } from '~/community/[communityId]/common/notes-editor';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { LastModified } from '~/view/last-modified';
import { usePageContext } from '../page-context';
import { MembershipInfoEditor } from './membership-info-editor';
import { InputData, useHookFormContext } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ onSave }) => {
  const { membershipEditor } = usePageContext();
  const { property, disclosure } = membershipEditor;
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
          <ModalHeader>Membership Detail</ModalHeader>
          <ModalBody className="gap-4">
            <MembershipInfoEditor property={property} />
            <NotesEditor controlName="notes" />
          </ModalBody>
          <ModalFooter className="flex items-center justify-between">
            <LastModified
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
