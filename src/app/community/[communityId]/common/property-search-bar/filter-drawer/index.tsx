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
import {
  EventSelect,
  GpsSelect,
  YearSelect,
} from '~/community/[communityId]/common/filter-component';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { useHookForm, type InputData } from '../use-hook-form';

export interface DrawerArg {
  memberYear: number | null;
  nonMemberYear: number | null;
  memberEvent: string | null;
  withGps: boolean | null;
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
  const { formMethods } = useHookForm(
    arg.memberYear,
    arg.nonMemberYear,
    arg.memberEvent,
    arg.withGps
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
  const memberEvent = watch('memberEvent');

  const canClear = React.useMemo(() => {
    return !!memberYear || !!nonMemberYear || !!memberEvent;
  }, [memberYear, nonMemberYear, memberEvent]);

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent>
            <DrawerHeader>Filter Options</DrawerHeader>
            <DrawerBody className="flex flex-col gap-4">
              <YearSelect
                label="Member In Year"
                description="Show properties who are members in the specified year"
                controlName="memberYear"
                size="sm"
              />
              <YearSelect
                label="Non-Member In Year"
                description="Show properties who are not members in the specified year"
                controlName="nonMemberYear"
                size="sm"
              />
              <EventSelect
                description="Show properties who registered at the specified event"
                controlName="memberEvent"
                size="sm"
              />
              <GpsSelect
                description="Show properties with or without GPS coordinate"
                controlName="withGps"
                size="sm"
              />
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
                  setValue('memberYear', null, { shouldDirty: true });
                  setValue('nonMemberYear', null, { shouldDirty: true });
                  setValue('memberEvent', null, { shouldDirty: true });
                  setValue('withGps', null, { shouldDirty: true });
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
