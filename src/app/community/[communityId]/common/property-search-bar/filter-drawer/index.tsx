import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { useAppContext } from '~/custom-hooks/app-context';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const FilterDrawer: React.FC<Props> = ({ className }) => {
  const { minYear, maxYear } = useAppContext();
  const {
    memberYear,
    nonMemberYear,
    event,
    filterSpecified,
    drawerDisclosure,
  } = useFilterBarContext();
  const { isOpen, onOpenChange } = drawerDisclosure;

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader>Filter Options</DrawerHeader>
            <DrawerBody className="flex flex-col gap-4">
              <YearSelect
                yearRange={[minYear, maxYear]}
                year={memberYear}
                label="Member In Year"
                description="Show properties who are members in the specified year"
              />
              <YearSelect
                yearRange={[minYear, maxYear]}
                year={nonMemberYear}
                label="Non-Member In Year"
                description="Show properties who are not members in the specified year"
              />
              <EventSelect event={event} />
            </DrawerBody>
            <DrawerFooter>
              <Button
                className="h-auto"
                variant="flat"
                isDisabled={!filterSpecified}
                onPress={() => {
                  memberYear.clear();
                  nonMemberYear.clear();
                  event.clear();
                }}
              >
                Reset
              </Button>
              <Button color="primary" onPress={onClose}>
                Done
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
