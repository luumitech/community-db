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

interface Props {
  community: GQL.CommunityId_CommunityDeleteModalFragment;
  disclosure: UseDisclosureReturn;
  onDelete: () => Promise<void>;
}

export const DeleteModal: React.FC<Props> = ({
  community,
  disclosure,
  onDelete,
}) => {
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
        <ModalHeader>Delete Community</ModalHeader>
        <ModalBody>
          <div>
            This will delete community &apos;{community.name}&apos; and all data
            within it.
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
