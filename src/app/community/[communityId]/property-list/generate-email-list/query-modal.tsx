import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Modal, ModalContent, ModalHeader } from '~/view/base/modal';
import { PanelContextProvider } from './panel-context';
import { PanelWrapper } from './panel-wrapper';
import { useHookForm } from './use-hook-form';

export interface ModalArg {
  communityId: string;
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
}

export const QueryModal: React.FC<Props> = ({ communityId, disclosure }) => {
  const { isOpen, onOpenChange } = disclosure;
  const { formMethods } = useHookForm(communityId);

  return (
    <Modal
      size="md"
      placement="top-center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      // confirmation={isDirty}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent className="overflow-hidden">
        {(closeModal) => (
          <FormProvider {...formMethods}>
            <ModalHeader>Generate Email List</ModalHeader>
            <PanelContextProvider disclosure={disclosure}>
              <PanelWrapper />
            </PanelContextProvider>
          </FormProvider>
        )}
      </ModalContent>
    </Modal>
  );
};
