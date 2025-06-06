import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { usePageContext } from '../page-context';
import { useHookForm } from './use-hook-form';

export interface ModalArg {}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onDelete: (communityId: string, propertyId: string) => Promise<void>;
}

export const DeleteModal: React.FC<Props> = ({ disclosure, onDelete }) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { community } = usePageContext();
  const { property } = useHookForm();

  const onSubmit = React.useCallback(
    async () =>
      startTransition(async () => {
        try {
          await onDelete(community.id, property.id);
          onClose();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onDelete, onClose, community, property]
  );

  return (
    <Modal
      size="5xl"
      placement="top-center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader>{appLabel('propertyDelete')}</ModalHeader>
            <ModalBody>
              <div>
                This will delete property &apos;{property.address}&apos; and all
                data within it.
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={closeModal}>
                Cancel
              </Button>
              <Button
                color="danger"
                confirmation
                confirmationArg={{ body: 'Are you sure?' }}
                isLoading={pending}
                onPress={onSubmit}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
