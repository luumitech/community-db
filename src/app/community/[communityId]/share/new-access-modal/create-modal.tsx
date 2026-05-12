import { UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Modal } from '~/view/base/modal';
import type { AccessEntry } from '../_type';
import { RoleSelect } from '../role-select';
import { EmailEditor } from './email-editor';
import { InputData, useHookForm } from './use-hook-form';

export interface ModalArg {
  communityId: string;
  accessList: AccessEntry[];
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const CreateModal: React.FC<Props> = ({
  communityId,
  accessList,
  disclosure,
  onSave,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formMethods } = useHookForm(communityId, accessList);
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
            <Modal.Header>Add User To Access List</Modal.Header>
            <Modal.Body>
              <EmailEditor />
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
              >
                Share
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};
