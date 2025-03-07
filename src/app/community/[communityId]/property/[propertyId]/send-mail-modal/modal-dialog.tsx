import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { type OccupantList } from './_type';
import { MailForm } from './mail-form';
import {
  defaultInputData,
  useHookForm,
  type InputData,
  type ModifyFragmentType,
} from './use-hook-form';

export interface ModalArg {
  community: ModifyFragmentType;
  occupantList: OccupantList;
  membershipYear: string;
}
interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<ModifyFragmentType | undefined>;
  onSend: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({
  community: fragment,
  membershipYear,
  occupantList,
  disclosure,
  onSave,
  onSend,
}) => {
  const { formMethods } = useHookForm(fragment, membershipYear, occupantList);
  const [saveTemplatePending, saveTemplateStartTransition] =
    React.useTransition();
  const [sendMailPending, sendMailStartTransition] = React.useTransition();
  const { isOpen, onOpenChange, onClose } = disclosure;
  const { formState, reset } = formMethods;
  const { isDirty } = formState;

  const onSaveTemplate = React.useCallback(
    async (inputData: InputData) =>
      saveTemplateStartTransition(async () => {
        try {
          const community = await onSave(inputData);
          if (community) {
            reset(defaultInputData(community, membershipYear, occupantList));
          }
        } catch (err) {
          // error handled by parent
        }
      }),
    [membershipYear, occupantList, onSave, reset]
  );

  const onSendMail = React.useCallback(
    async (inputData: InputData) =>
      sendMailStartTransition(async () => {
        try {
          await onSend(inputData);
          onClose();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onClose, onSend]
  );

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
                <ModalHeader>Compose Confirmation Email</ModalHeader>
                <ModalBody>
                  <MailForm />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    variant="bordered"
                    isLoading={saveTemplatePending}
                    isDisabled={sendMailPending || !isDirty}
                    onPress={() => formMethods.handleSubmit(onSaveTemplate)()}
                  >
                    Save Email Template
                  </Button>
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
