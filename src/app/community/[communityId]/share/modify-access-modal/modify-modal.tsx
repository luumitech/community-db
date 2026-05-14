import { UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Modal } from '~/view/base/modal';
import { type AccessEntry } from '../_type';
import { RoleSelect } from '../role-select';
import {
  InputData,
  useHookForm,
  type ModifyFragmentType,
} from './use-hook-form';

export interface ModalArg {
  access: ModifyFragmentType & AccessEntry;
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({
  access: fragment,
  disclosure,
  onSave,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formMethods, access } = useHookForm(fragment);
  const { formState, handleSubmit } = formMethods;
  const { isDirty } = formState;

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
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
            <Modal.Header>Modify Access for {access.user.email}</Modal.Header>
            <Modal.Body>
              <RoleSelect controlName="role" />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="bordered" isDisabled={pending} onPress={close}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                isDisabled={!formState.isDirty}
                isLoading={pending}
                // Trigger confirmation if removing own admin role
                confirmation={fragment.isSelf}
                confirmationArg={{
                  body: (
                    <>
                      <p className="text-danger">
                        Removing the{' '}
                        <span className="font-semibold">Admin</span> role will
                        prevent you from managing user access in the future.
                      </p>
                      <p>Proceed?</p>
                    </>
                  ),
                }}
              >
                Save
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};
