import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { Tab, Tabs } from '@nextui-org/tabs';
import React from 'react';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { LastModified } from '~/view/last-modified';
import { EventListEditor } from './event-list-editor';
import { NameEditor } from './name-editor';
import { PaymentMethodListEditor } from './payment-method-list-editor';
import { TicketListEditor } from './ticket-list-editor';
import {
  InputData,
  useHookFormContext,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({ hookForm, onSave }) => {
  const { community, disclosure } = hookForm;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formState, handleSubmit } = useHookFormContext();
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          await onSave(input);
          onClose?.();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSave, onClose]
  );

  return (
    <Modal
      size="5xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader className="flex justify-between">
            Edit Community
            <LastModified
              className="text-right text-foreground-400"
              updatedAt={community.updatedAt}
              userFragment={community.updatedBy}
            />
          </ModalHeader>
          <ModalBody>
            <Tabs
              aria-label="Edit Community Options"
              classNames={{
                tabList:
                  'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                tab: 'max-w-fit px-0 h-12',
              }}
              color="primary"
              variant="underlined"
            >
              <Tab key="nameEditor" title="General">
                <NameEditor />
              </Tab>
              <Tab key="eventEditor" title="Events">
                <EventListEditor />
              </Tab>
              <Tab key="ticketListEditor" title="Tickets">
                <TicketListEditor />
              </Tab>
              <Tab key="paymentMethodEditor" title="Payment Methods">
                <PaymentMethodListEditor />
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" confirmation={isDirty} onPress={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isDisabled={!formState.isDirty || pending}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};
