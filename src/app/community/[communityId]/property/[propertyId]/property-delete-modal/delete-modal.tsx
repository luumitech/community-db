import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import React from 'react';
import { Button } from '~/view/base/button';
import { usePageContext } from '../page-context';

interface Props {
  onDelete: () => Promise<void>;
}

export const DeleteModal: React.FC<Props> = ({ onDelete }) => {
  const { propertyDelete } = usePageContext();
  const { disclosure, property } = propertyDelete;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    async () =>
      startTransition(async () => {
        try {
          await onDelete();
          onClose?.();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onDelete, onClose]
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
      <ModalContent>
        <ModalHeader>Delete Property</ModalHeader>
        <ModalBody>
          <div>
            This will delete property &apos;{property.address}&apos; and all
            data within it.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="danger"
            confirmation
            confirmationArg={{
              bodyText: 'Are you sure?',
            }}
            isDisabled={pending}
            onPress={onSubmit}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
