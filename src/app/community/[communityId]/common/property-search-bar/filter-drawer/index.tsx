import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@nextui-org/react';
import { type UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Form } from '~/view/base/form';
import {
  useHookFormContext,
  useIsFilterSpecified,
  type InputData,
} from '../use-hook-form';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  disclosure: UseDisclosureReturn;
  onChange?: (input: InputData) => void;
}

export const FilterDrawer: React.FC<Props> = ({ disclosure, onChange }) => {
  const { minYear, maxYear } = useAppContext();
  const { formState, handleSubmit, setValue } = useHookFormContext();
  const isFilterSpecified = useIsFilterSpecified();
  const { isOpen, onOpenChange, onClose } = disclosure;
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) => {
      onChange?.(input);
      onClose();
    },
    [onClose, onChange]
  );

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
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
              isDisabled={!isFilterSpecified}
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
    </Drawer>
  );
};
