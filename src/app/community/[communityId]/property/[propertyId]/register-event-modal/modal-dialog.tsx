import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { MemberStatusChip } from '~/community/[communityId]/common/member-status-chip';
import { NotesEditor } from '~/community/[communityId]/common/notes-editor';
import { getCurrentDate } from '~/lib/date-util';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { LastModified } from '~/view/last-modified';
import { usePageContext } from '../page-context';
import { EventInfoEditor } from './event-info-editor';
import { InputData, useHookFormContext } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ onSave }) => {
  const { registerEvent } = usePageContext();
  const { disclosure, property } = registerEvent;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formState, handleSubmit, watch } = useHookFormContext();
  const canRegister = watch('hidden.canRegister');
  const isMember = watch('hidden.isMember');
  const memberYear = watch('membership.year');
  const eventName = watch('event.eventName');
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
          <ModalBody className="gap-6">
            <div className="flex flex-col gap-2">
              <MemberStatusChip isMember={isMember} hideText>
                {memberYear}
              </MemberStatusChip>
              <div className="flex items-center gap-8 text-sm">
                <span className="text-foreground-500 font-semibold">
                  Current Event
                </span>
                <EventChip eventName={eventName} />
                <span>{getCurrentDate()}</span>
              </div>
            </div>
            <EventInfoEditor />
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
                confirmation={canSave}
                {...(canRegister && {
                  confirmationArg: {
                    bodyText: (
                      <p>
                        This event has not been registered.
                        <br />
                        Are you sure?
                      </p>
                    ),
                  },
                })}
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
                {canRegister ? 'Register' : 'Save'}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};
