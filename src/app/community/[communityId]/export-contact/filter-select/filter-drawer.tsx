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
  YearSelect,
} from '~/community/[communityId]/common/filter-component';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { useHookForm, type InputData } from './use-hook-form';

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

  const memberYearList = watch('memberYearList');
  const nonMemberYear = watch('nonMemberYear');
  const event = watch('memberEvent');

  const canClear = React.useMemo(() => {
    return memberYearList.length > 0 || !!nonMemberYear || !!event;
  }, [memberYearList, nonMemberYear, event]);

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent>
            <DrawerHeader>Filter Options</DrawerHeader>
            <DrawerBody className="flex flex-col gap-4">
              <YearSelect
                controlName="memberYearList"
                size="sm"
                label="Member In Year(s)"
                description="Include only members who have memberships in the specified year"
                autoFocus
              />
              <YearSelect
                controlName="nonMemberYear"
                size="sm"
                label="Non-Member In Year"
                description="Include only members who do have memberships in the specified year"
              />
              <EventSelect
                controlName="memberEvent"
                size="sm"
                label="Membership Event"
                description="Include only members who registered at the specified event"
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
                  setValue('memberYearList', [], { shouldDirty: true });
                  setValue('nonMemberYear', null, { shouldDirty: true });
                  setValue('memberEvent', null, { shouldDirty: true });
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
