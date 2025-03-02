import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { MemberStatusChip } from '~/community/[communityId]/common/member-status-chip';
import { NotesEditor } from '~/community/[communityId]/common/notes-editor';
import { FormProvider } from '~/custom-hooks/hook-form';
import { getCurrentDate } from '~/lib/date-util';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { LastModified } from '~/view/last-modified';
import { EventInfoEditor } from './event-info-editor';
import { InputData, XtraArgProvider, useHookForm } from './use-hook-form';

export interface ModalArg {}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ disclosure, onSave }) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formMethods, ...xtraProps } = useHookForm();
  const { getValues, formState, handleSubmit } = formMethods;
  const canRegister = getValues('hidden.canRegister');
  const isMember = getValues('hidden.isMember');
  const memberYear = getValues('membership.year');
  const eventName = getValues('event.eventName');
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
      confirmation={canSave}
      {...(canRegister && {
        confirmationArg: {
          body: (
            <p>
              This event has not been registered.
              <br />
              Are you sure?
            </p>
          ),
        },
      })}
      placement="top-center"
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <XtraArgProvider {...xtraProps}>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent>
              {(closeModal) => (
                <>
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
                      updatedAt={xtraProps.property.updatedAt}
                      updatedBy={xtraProps.property.updatedBy}
                    />
                    <div className="flex items-center gap-2">
                      <Button variant="bordered" onPress={closeModal}>
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
                </>
              )}
            </ModalContent>
          </Form>
        </FormProvider>
      </XtraArgProvider>
    </Modal>
  );
};
