import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { type OccupantList } from './_type';
import { MailForm } from './mail-form';
import { useHookForm, type InputData } from './use-hook-form';

export interface ModalArg {
  occupantList: OccupantList;
  membershipYear: number;
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModalDialog: React.FC<Props> = ({
  membershipYear,
  occupantList,
  disclosure,
  onSave,
}) => {
  const { formMethods } = useHookForm(membershipYear, occupantList);
  const [pending, startTransition] = React.useTransition();
  const { isOpen, onOpenChange, onClose } = disclosure;

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
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader>Send Confirmation Email?</ModalHeader>
                <ModalBody>
                  <MailForm />
                </ModalBody>
                <ModalFooter>
                  <Button isDisabled={pending} onPress={closeModal}>
                    No
                  </Button>
                  <Button type="submit" color="primary" isLoading={pending}>
                    Yes
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
