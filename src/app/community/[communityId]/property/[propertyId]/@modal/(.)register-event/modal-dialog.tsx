import { useRouter } from 'next/navigation';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { MemberStatusChip } from '~/community/[communityId]/common/member-status-chip';
import { NotesEditor } from '~/community/[communityId]/common/notes-editor';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appLabel } from '~/lib/app-path';
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
import { usePreSubmit } from './pre-submit';
import { InputData, XtraArgProvider, useHookForm } from './use-hook-form';

interface Props {
  eventName: string;
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({ eventName, onSave }) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const { formMethods, ...xtraProps } = useHookForm(eventName);
  const { propagatePaymentMethod } = usePreSubmit(formMethods);
  const { getValues, formState, handleSubmit } = formMethods;
  const canRegister = getValues('hidden.canRegister');
  const isMember = getValues('hidden.isMember');
  const memberYear = getValues('membership.year');
  const { isDirty } = formState;

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

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
          goBack();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSave, goBack]
  );

  const preSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    async (evt) => {
      propagatePaymentMethod();
      await handleSubmit(onSubmit)(evt);
    },
    [propagatePaymentMethod, handleSubmit, onSubmit]
  );

  return (
    <Modal
      size="5xl"
      placement="top-center"
      isOpen
      onOpenChange={goBack}
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
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <XtraArgProvider {...xtraProps}>
        <FormProvider {...formMethods}>
          <Form onSubmit={preSubmit}>
            <ModalContent>
              {(closeModal) => (
                <>
                  <ModalHeader>{appLabel('registerEvent')}</ModalHeader>
                  <ModalBody className="gap-6">
                    <div className="flex flex-col gap-2">
                      <MemberStatusChip isMember={isMember} hideText>
                        {memberYear}
                      </MemberStatusChip>
                      <div className="flex items-center gap-8 text-sm">
                        <span className="font-semibold text-foreground-500">
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
                      <Button
                        variant="bordered"
                        isDisabled={pending}
                        onPress={closeModal}
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
                </>
              )}
            </ModalContent>
          </Form>
        </FormProvider>
      </XtraArgProvider>
    </Modal>
  );
};
