import { useRouter } from 'next/navigation';
import React from 'react';
import { type FieldPath } from 'react-hook-form';
import { NotesEditor } from '~/community/[communityId]/common/notes-editor';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appLabel } from '~/lib/app-path';
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
import { MembershipInfoEditor } from './membership-info-editor';
import { InputData, useHookForm } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
  /**
   * Focus on a specific input field initially
   *
   * `notes-helper`: The One line Notes helper above the TextArea
   */
  autoFocus?: FieldPath<InputData> | 'notes-helper';
}

export const ModalDialog: React.FC<Props> = ({ onSave, autoFocus }) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const { formMethods, property } = useHookForm();
  const { formState, handleSubmit, setFocus } = formMethods;
  const { isDirty } = formState;

  React.useEffect(() => {
    if (setFocus && autoFocus != null) {
      switch (autoFocus) {
        case 'notes-helper':
          break;
        default:
          setFocus(autoFocus);
      }
    }
  }, [setFocus, autoFocus]);

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

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

  return (
    <Modal
      size="5xl"
      isOpen
      onOpenChange={goBack}
      confirmation={isDirty}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader>{appLabel('membershipEditor')}</ModalHeader>
                <ModalBody className="gap-4">
                  <MembershipInfoEditor property={property} />
                  <NotesEditor
                    controlName="notes"
                    autoFocus={autoFocus === 'notes-helper'}
                  />
                </ModalBody>
                <ModalFooter className="flex items-center justify-between">
                  <LastModified
                    updatedAt={property.updatedAt}
                    updatedBy={property.updatedBy}
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
                      isDisabled={!formState.isDirty}
                      isLoading={pending}
                    >
                      Save
                    </Button>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
