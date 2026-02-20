import { useRouter } from 'next/navigation';
import React from 'react';
import { OccupancyEditor } from '~/community/[communityId]/common/occupancy-editor';
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
import { MailchimpNotice } from './mailchimp-notice';
import { InputData, useHookForm } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
  defaultEmail?: string;
}

export const ModalDialog: React.FC<Props> = ({ onSave, defaultEmail }) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const { formMethods } = useHookForm();
  const { control, formState, handleSubmit } = formMethods;
  const { isDirty } = formState;

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
                <ModalHeader className="flex flex-col">
                  {appLabel('occupancyEditor')}
                  <MailchimpNotice />
                </ModalHeader>
                <ModalBody>
                  <OccupancyEditor
                    controlNamePrefix="occupantList"
                    defaultEmail={defaultEmail}
                  />
                </ModalBody>
                <ModalFooter>
                  <div className="grow" />
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
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
