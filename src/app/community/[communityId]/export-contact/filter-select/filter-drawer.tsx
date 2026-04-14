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
  TicketSelect,
  YearSelect,
} from '~/community/[communityId]/common/filter-component';
import { FormProvider } from '~/custom-hooks/hook-form';
import { type FilterT } from '~/lib/reducers/search-bar';
import { Form } from '~/view/base/form';
import { useHookForm, type InputData } from './use-hook-form';

export type DrawerArg = FilterT;

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
  onFilterChange?: (input: InputData) => Promise<void>;
}

export const FilterDrawer: React.FC<Props> = ({
  disclosure,
  onFilterChange,
  ...arg
}) => {
  const { formMethods, reset, canReset } = useHookForm(arg);
  const { handleSubmit, formState } = formMethods;
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
          <DrawerContent>
            <DrawerHeader>Filter Options</DrawerHeader>
            <DrawerBody className="flex flex-col gap-4">
              <YearSelect
                controlName="memberYearList"
                isControlled
                isMember
                size="sm"
                label="Member In Year(s)"
                description="Include only members who have memberships in the specified year(s)"
                autoFocus
                isClearable
              />
              <YearSelect
                controlName="nonMemberYearList"
                isControlled
                isMember={false}
                size="sm"
                label="Non-Member In Year(s)"
                description="Include only members who do NOT have memberships in the specified year(s)"
                isClearable
              />
              <EventSelect
                controlName="memberEventList"
                isControlled
                size="sm"
                label="Membership Event(s)"
                description="Include only members who registered at the specified event(s)"
                isClearable
              />
              <TicketSelect
                controlName="ticketList"
                isControlled
                size="sm"
                label="Ticket Name(s)"
                description="Include only members who purchased specified ticket(s)"
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
                isDisabled={!canReset}
                onPress={reset}
              >
                Reset
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
