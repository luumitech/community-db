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
import { type RootState } from '~/lib/reducers';
import { Form } from '~/view/base/form';
import { useHookForm, type InputData } from './use-hook-form';

export type DrawerArg = Pick<
  RootState['searchBar'],
  'memberYearList' | 'nonMemberYearList' | 'memberEventList'
>;

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
  const nonMemberYearList = watch('nonMemberYearList');
  const eventList = watch('memberEventList');

  const canClear = React.useMemo(() => {
    return (
      memberYearList.length > 0 ||
      nonMemberYearList.length > 0 ||
      eventList.length > 0
    );
  }, [memberYearList, nonMemberYearList, eventList]);

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
                description="Include only members who have memberships in the specified year(s)"
                autoFocus
                isClearable
              />
              <YearSelect
                controlName="nonMemberYearList"
                size="sm"
                label="Non-Member In Year(s)"
                description="Include only members who do NOT have memberships in the specified year(s)"
                isClearable
              />
              <EventSelect
                controlName="memberEventList"
                size="sm"
                label="Membership Event(s)"
                description="Include only members who registered at the specified event(s)"
                isClearable
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
                  setValue('nonMemberYearList', [], { shouldDirty: true });
                  setValue('memberEventList', [], { shouldDirty: true });
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
