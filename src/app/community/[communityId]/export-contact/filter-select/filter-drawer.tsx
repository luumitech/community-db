import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@heroui/react';
import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { EventSelect } from './event-select';
import { useHookForm, type InputData } from './use-hook-form';
import { YearSelect } from './year-select';

export type DrawerArg = InputData;

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
  onFilterChange?: (input: InputData) => Promise<void>;
}

export const FilterDrawer: React.FC<Props> = ({
  disclosure,
  onFilterChange,
  ...arg
}) => {
  const { formMethods } = useHookForm(arg);
  const { handleSubmit, formState, setValue, watch } = formMethods;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) => {
      await onFilterChange?.(input);
      onClose();
    },
    [onClose, onFilterChange]
  );

  const memberYear = watch('filter.memberYear');
  const nonMemberYear = watch('filter.nonMemberYear');
  const event = watch('filter.memberEvent');

  const canClear = React.useMemo(() => {
    return !!memberYear || !!nonMemberYear || !!event;
  }, [memberYear, nonMemberYear, event]);

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent>
            <DrawerHeader>Filter Options</DrawerHeader>
            <DrawerBody className="flex flex-col gap-4">
              <YearSelect
                controlName="filter.memberYear"
                label="Member In Year"
                description="Include only members who have memberships in the specified year"
                autoFocus
              />
              <YearSelect
                controlName="filter.nonMemberYear"
                label="Non-Member In Year"
                description="Include only members who do have memberships in the specified year"
              />
              <EventSelect />
            </DrawerBody>
            <DrawerFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                variant="light"
                color="danger"
                isDisabled={!canClear}
                onPress={() => {
                  setValue('filter.memberYear', null, { shouldDirty: true });
                  setValue('filter.nonMemberYear', null, { shouldDirty: true });
                  setValue('filter.memberEvent', null, { shouldDirty: true });
                }}
              >
                Clear
              </Button>
              <Button color="primary" isDisabled={!isDirty} type="submit">
                Apply
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Form>
      </FormProvider>
    </Drawer>
  );
};
