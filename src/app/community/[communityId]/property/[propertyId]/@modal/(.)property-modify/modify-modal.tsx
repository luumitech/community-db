import { useRouter } from 'next/navigation';
import React from 'react';
import { AddressEditor } from '~/community/[communityId]/common/address-editor';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Modal } from '~/view/base/modal';
import { LastModified } from '~/view/last-modified';
import { useHookForm, type InputData } from './use-hook-form';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({ onSave }) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const { formMethods, property } = useHookForm();
  const { formState, handleSubmit } = formMethods;
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
      size="cover"
      isOpen
      onOpenChange={goBack}
      confirmation={isDirty}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      renderWrapper={(content, clsNm) => (
        <FormProvider {...formMethods}>
          <Form className={clsNm} onSubmit={handleSubmit(onSubmit)}>
            {content}
          </Form>
        </FormProvider>
      )}
    >
      <Modal.Content>
        {({ close }) => (
          <>
            <Modal.Header>{appLabel('propertyModify')}</Modal.Header>
            <Modal.Body>
              <AddressEditor />
            </Modal.Body>
            <Modal.Footer className="flex items-center justify-between">
              <LastModified
                className="text-right"
                updatedAt={property.updatedAt}
                updatedBy={property.updatedBy}
              />
              <div className="flex items-center gap-2">
                <Button variant="bordered" isDisabled={pending} onPress={close}>
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
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};
