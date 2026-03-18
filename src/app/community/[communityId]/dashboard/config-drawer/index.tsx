import { Drawer } from '@heroui/react';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { useWidgetDefinition } from '../widget-definition';
import { ConfigContent, type DrawerArg } from './config-content';
import { DrawerButton } from './drawer-button';
import { useHookForm, type InputData } from './use-hook-form';

const useDrawerControl = useDisclosureWithArg<DrawerArg>;

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ConfigDrawer: React.FC<Props> = ({ onSave }) => {
  const [pending, startTransition] = React.useTransition();
  const { arg, disclosure, open } = useDrawerControl();
  const { isOpen, onOpenChange, onClose } = disclosure;
  const { formMethods } = useHookForm();
  const { handleSubmit, reset } = formMethods;

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
  const openDrawer = React.useCallback(() => open({}), [open]);

  return (
    <>
      <DrawerButton onOpen={openDrawer} />
      {arg != null && (
        <Drawer
          isOpen={isOpen}
          placement="left"
          onOpenChange={onOpenChange}
          onClose={() => reset()}
        >
          <FormProvider {...formMethods}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <ConfigContent {...arg} disclosure={disclosure} />
            </Form>
          </FormProvider>
        </Drawer>
      )}
    </>
  );
};
