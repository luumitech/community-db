import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { Drawer } from '~/view/base/drawer';
import { Form } from '~/view/base/form';
import { EventSelect } from '../event-select';
import { GpsSelect } from '../gps-select';
import { TicketSelect } from '../ticket-select';
import { YearSelect } from '../year-select';
import { useHookForm, type HookFormArg, type InputData } from './use-hook-form';

export { type InputData as FilterInputData } from './use-hook-form';

export interface FilterDrawerArg {}

export interface FilterDrawerProps extends FilterDrawerArg, HookFormArg {
  disclosure: UseDisclosureReturn;
  /** When 'Apply' is clicked */
  onFilterChange?: (input: InputData) => Promise<void>;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  disclosure,
  filtersToShow,
  defaultState,
  onFilterChange,
}) => {
  const { formMethods, canReset, reset } = useHookForm({
    filtersToShow,
    defaultState,
  });
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
              {filtersToShow.includes('memberYearList') && (
                <YearSelect
                  label="Member In Year(s)"
                  description="Show properties that are members in the specified year(s)"
                  isMember
                  controlName="memberYearList"
                  isControlled
                  size="sm"
                  isClearable
                />
              )}
              {filtersToShow.includes('nonMemberYearList') && (
                <YearSelect
                  label="Non-Member In Year(s)"
                  description="Show properties that are NOT members in the specified year(s)"
                  isMember={false}
                  controlName="nonMemberYearList"
                  isControlled
                  size="sm"
                  isClearable
                />
              )}
              {filtersToShow.includes('memberEventList') && (
                <EventSelect
                  description="Show properties that registered at the specified event(s)"
                  controlName="memberEventList"
                  isControlled
                  size="sm"
                  isClearable
                />
              )}
              {filtersToShow.includes('ticketList') && (
                <TicketSelect
                  description="Show properties with members who purchased specified ticket(s)"
                  controlName="ticketList"
                  isControlled
                  size="sm"
                  isClearable
                />
              )}
              {filtersToShow.includes('withGps') && (
                <GpsSelect
                  description="Show properties with or without GPS coordinate"
                  controlName="withGps"
                  size="sm"
                  isClearable
                />
              )}
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
