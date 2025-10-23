import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
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
import { useLayoutContext } from '../../layout-context';
import { MailForm } from './mail-form';
import {
  defaultInputData,
  useHookForm,
  type InputData,
  type ModifyFragmentType,
} from './use-hook-form';

interface Props {
  membershipYear: string;
  onSave: (input: InputData) => Promise<ModifyFragmentType | undefined>;
  onSend: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({
  membershipYear,
  onSave,
  onSend,
}) => {
  const router = useRouter();
  const { property: propertyFragment } = useLayoutContext();
  const { canEdit } = useSelector((state) => state.community);
  const { formMethods } = useHookForm(membershipYear);
  const [saveTemplatePending, saveTemplateStartTransition] =
    React.useTransition();
  const [sendMailPending, sendMailStartTransition] = React.useTransition();
  const { formState, reset } = formMethods;
  const { isDirty } = formState;

  const onSaveTemplate = React.useCallback(
    async (inputData: InputData) =>
      saveTemplateStartTransition(async () => {
        try {
          const community = await onSave(inputData);
          if (community) {
            reset(
              defaultInputData(community, propertyFragment, membershipYear)
            );
          }
        } catch (err) {
          // error handled by parent
        }
      }),
    [membershipYear, propertyFragment, onSave, reset]
  );

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

  const onSendMail = React.useCallback(
    async (inputData: InputData) =>
      sendMailStartTransition(async () => {
        try {
          await onSend(inputData);
          goBack();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSend, goBack]
  );

  return (
    <Modal
      size="2xl"
      placement="top-center"
      isOpen
      onOpenChange={goBack}
      confirmation={isDirty}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <FormProvider {...formMethods}>
        <Form>
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader>{appLabel('composeMembershipMail')}</ModalHeader>
                <ModalBody>
                  <MailForm />
                </ModalBody>
                <ModalFooter>
                  {canEdit && (
                    <Button
                      color="primary"
                      variant="bordered"
                      isLoading={saveTemplatePending}
                      isDisabled={sendMailPending || !isDirty}
                      onPress={() => formMethods.handleSubmit(onSaveTemplate)()}
                    >
                      Save Email Template
                    </Button>
                  )}
                  <div className="flex-grow" />
                  <Button
                    isDisabled={saveTemplatePending || sendMailPending}
                    onPress={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    isLoading={sendMailPending}
                    isDisabled={saveTemplatePending}
                    onPress={() => formMethods.handleSubmit(onSendMail)()}
                  >
                    Launch Email Client...
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
