import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { MemberStatusChip } from '~/community/[communityId]/common/member-status-chip';
import { getCurrentDate } from '~/lib/date-util';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { usePageContext } from '../page-context';
import { EventInfoEditor } from './event-info-editor';
import { InputData, useHookFormContext } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ onSave }) => {
  const { registerEvent } = usePageContext();
  const { disclosure } = registerEvent;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formState, handleSubmit, watch } = useHookFormContext();
  const canRegister = watch('canRegister');
  const isMember = watch('isMember');
  const { isDirty } = formState;

  const canSave = React.useMemo(() => {
    if (canRegister) {
      return true;
    }
    return isDirty;
  }, [isDirty, canRegister]);

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
      placement="top-center"
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Event Registration</ModalHeader>
          <ModalBody>
            <MemberStatusChip isMember={isMember} />
            <EventInfoEditor />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              confirmation={canRegister}
              confirmationArg={{
                bodyText: (
                  <p>
                    The event has not been registered.
                    <br />
                    Are you sure?
                  </p>
                ),
              }}
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={pending}
              isDisabled={!canSave}
            >
              Register
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};
