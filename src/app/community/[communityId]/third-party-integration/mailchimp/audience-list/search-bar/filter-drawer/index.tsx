import { Button } from '@heroui/react';
import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Drawer } from '~/view/base/drawer';
import { Form } from '~/view/base/form';
import { StatusSelect } from '../../status-select';
import { useHookForm, type InputData } from '../use-hook-form';
import { OptOutSelect } from './opt-out-select';
import { WarningSelect } from './warning-select';

export interface DrawerArg {}

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
  onFilterChange?: (input: InputData) => Promise<void>;
}

export const FilterDrawer: React.FC<Props> = ({
  disclosure,
  onFilterChange,
  ...arg
}) => {
  const { formMethods, canReset, reset } = useHookForm();
  const { formState, handleSubmit } = formMethods;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) => {
      await onFilterChange?.(input);
      onClose();
    },
    [onClose, onFilterChange]
  );

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Drawer.Content>
            <Drawer.Header>Filter Options</Drawer.Header>
            <Drawer.Body className="flex flex-col gap-4">
              <StatusSelect
                controlName="subscriberStatusList"
                isControlled
                label="Mailchimp Subscriber Status"
                placeholder="Unspecified"
                selectionMode="multiple"
                isClearable
                isMultiline
                description="Show only entries matching the selected status"
              />
              <OptOutSelect />
              <WarningSelect />
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                variant="light"
                color="danger"
                isDisabled={!canReset}
                onPress={reset}
              >
                Reset
              </Button>
              <Button color="primary" isDisabled={!isDirty} type="submit">
                Apply
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Form>
      </FormProvider>
    </Drawer>
  );
};
