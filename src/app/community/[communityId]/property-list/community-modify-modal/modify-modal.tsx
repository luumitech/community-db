import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { getFragment } from '~/graphql/generated';
import { Button } from '~/view/base/button';
import { LastModified } from '~/view/last-modified';
import { ModifyFragment, type CommunityEntry } from '../_type';
import { EventListEditor } from './event-list-editor';
import { NameEditor } from './name-editor';
import { PaymentMethodListEditor } from './payment-method-list-editor';
import { InputData, useHookFormContext } from './use-hook-form';

interface Props {
  fragment: CommunityEntry;
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({
  fragment,
  disclosure,
  onSave,
}) => {
  const community = getFragment(ModifyFragment, fragment);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Edit Community</ModalHeader>
          <ModalBody>
            <NameEditor />
            <EventListEditor />
            <PaymentMethodListEditor />
            <LastModified
              className="text-right"
              updatedAt={community.updatedAt}
              userFragment={community.updatedBy}
            />
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
