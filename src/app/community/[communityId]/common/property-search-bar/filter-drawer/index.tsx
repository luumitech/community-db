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
import { type RootState } from '~/lib/reducers';
import { Form } from '~/view/base/form';
import { useHookForm, type InputData } from '../use-hook-form';

export type DrawerArg = RootState['searchBar'];

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

  const memberYearList = watch('memberYearList');
  const nonMemberYearList = watch('nonMemberYearList');
  const memberEventList = watch('memberEventList');

  const canClear = React.useMemo(() => {
    return (
      memberYearList.length > 0 ||
      nonMemberYearList.length > 0 ||
      memberEventList.length > 0
    );
  }, [memberYearList, nonMemberYearList, memberEventList]);

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent>
            <DrawerHeader>Filter Options</DrawerHeader>
            <DrawerBody className="flex flex-col gap-4">
              <YearSelect
                label="Member In Year(s)"
                description="Show properties that are members in the specified year(s)"
                controlName="memberYearList"
                size="sm"
                isClearable
              />
              <YearSelect
                label="Non-Member In Year(s)"
                description="Show properties that are NOT members in the specified year(s)"
                controlName="nonMemberYearList"
                size="sm"
                isClearable
              />
              <EventSelect
                description="Show properties that registered at the specified event(s)"
                controlName="memberEventList"
                size="sm"
                isClearable
              />
              <GpsSelect
                description="Show properties with or without GPS coordinate"
                controlName="withGps"
                size="sm"
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
