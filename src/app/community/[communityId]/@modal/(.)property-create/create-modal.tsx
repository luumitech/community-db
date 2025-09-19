import { useRouter } from 'next/navigation';
import React from 'react';
import { AddressEditor } from '~/community/[communityId]/common/address-editor';
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
import { useLayoutContext } from '../../layout-context';
import { useHookForm, type InputData } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const CreateModal: React.FC<Props> = ({ onSave }) => {
  const router = useRouter();
  const { community: fragment } = useLayoutContext();
  const [pending, startTransition] = React.useTransition();
  const { community, formMethods } = useHookForm(fragment);
  const { handleSubmit, formState } = formMethods;
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
      placement="top-center"
      modalPath="propertyCreate"
      isOpen
      onOpenChange={goBack}
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      confirmation={isDirty}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader>{appLabel('propertyCreate')}</ModalHeader>
                <ModalBody>
                  <AddressEditor />
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="bordered"
                    isDisabled={pending}
                    onPress={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isDisabled={!formState.isDirty}
                    isLoading={pending}
                  >
                    Create
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
