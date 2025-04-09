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
import { useAppContext } from '~/custom-hooks/app-context';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { useHookForm, type InputData } from '../use-hook-form';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

export interface DrawerArg {
  memberYear?: string;
  nonMemberYear?: string;
  event?: string;
}

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
  onFilterChange?: (input: InputData) => Promise<void>;
}

export const FilterDrawer: React.FC<Props> = ({
  disclosure,
  onFilterChange,
  ...arg
}) => {
  const { minYear, maxYear } = useAppContext();
  const { formMethods } = useHookForm(
    arg.memberYear,
    arg.nonMemberYear,
    arg.event
  );
  const { formState, handleSubmit, setValue, watch } = formMethods;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) => {
      await onFilterChange?.(input);
      onClose();
    },
    [onClose, onFilterChange]
  );

  const memberYear = watch('memberYear');
  const nonMemberYear = watch('nonMemberYear');
  const event = watch('event');

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
                yearRange={[minYear, maxYear]}
                controlName="memberYear"
                label="Member In Year"
                description="Show properties who are members in the specified year"
              />
              <YearSelect
                yearRange={[minYear, maxYear]}
                controlName="nonMemberYear"
                label="Non-Member In Year"
                description="Show properties who are not members in the specified year"
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
                  setValue('memberYear', '', { shouldDirty: true });
                  setValue('nonMemberYear', '', { shouldDirty: true });
                  setValue('event', '', { shouldDirty: true });
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
