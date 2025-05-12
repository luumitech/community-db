import { Tab, Tabs } from '@heroui/tabs';
import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
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
import { LastModified } from '~/view/last-modified';
import { EventListEditor } from './event-list-editor';
import { GeneralTab } from './general-tab';
import { Integration } from './integration';
import { PaymentMethodListEditor } from './payment-method-list-editor';
import { TicketListEditor } from './ticket-list-editor';
import {
  InputData,
  useHookForm,
  type ModifyFragmentType,
} from './use-hook-form';

export interface ModalArg {
  community: ModifyFragmentType;
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({
  community: fragment,
  disclosure,
  onSave,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { formMethods, community } = useHookForm(fragment);
  const { formState, handleSubmit } = formMethods;
  const { isDirty, dirtyFields } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          if (!dirtyFields.mailchimpSetting?.apiKey) {
            /**
             * Mailchimp API fields has been obfuscated by the server, if user
             * did not change it explicitly, don't save it.
             */
            // @ts-expect-error It's okay to ignore this error
            delete input.mailchimpSetting.apiKey;
          }
          await onSave(input);
          onClose();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSave, onClose, dirtyFields]
  );

  return (
    <Modal
      size="5xl"
      placement="top-center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
                <ModalHeader className="flex justify-between">
                  {appLabel('communityModify')}
                </ModalHeader>
                <ModalBody>
                  <Tabs
                    aria-label={`${appLabel('communityModify')} Options`}
                    classNames={{
                      tabList:
                        'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                      tab: 'max-w-fit px-0 h-12',
                    }}
                    color="primary"
                    variant="underlined"
                  >
                    <Tab key="generalTab" title="General">
                      <GeneralTab />
                    </Tab>
                    <Tab key="eventTab" title="Events">
                      <EventListEditor />
                    </Tab>
                    <Tab key="ticketListTab" title="Tickets">
                      <TicketListEditor />
                    </Tab>
                    <Tab key="paymentMethodTab" title="Payment Methods">
                      <PaymentMethodListEditor />
                    </Tab>
                    <Tab key="integration" title="Integration">
                      <Integration />
                    </Tab>
                  </Tabs>
                </ModalBody>
                <ModalFooter className="flex items-center justify-between">
                  <LastModified
                    updatedAt={community.updatedAt}
                    updatedBy={community.updatedBy}
                  />
                  <div className="flex items-center gap-2">
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
                      isDisabled={!isDirty}
                      isLoading={pending}
                    >
                      Save
                    </Button>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
