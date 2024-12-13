import {
  Button,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
} from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { useAppContext } from '~/custom-hooks/app-context';
import { Icon } from '~/view/base/icon';
import { type CommunityEntry } from '../../_type';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
  community?: CommunityEntry;
}

export const AdvanceFilter: React.FC<Props> = ({ className, community }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { minYear, maxYear } = useAppContext();
  const { memberYear, nonMemberYear, event } = useFilterBarContext();

  const [selectedMemberYear] = memberYear;
  const [selectedNonMemberYear] = nonMemberYear;
  const [selectedEvent] = event;

  const filterSpecified = React.useMemo(() => {
    return !!selectedMemberYear || !!selectedNonMemberYear || !!selectedEvent;
  }, [selectedMemberYear, selectedNonMemberYear, selectedEvent]);

  const title = React.useMemo(() => {
    if (!filterSpecified) {
      return <span className="text-foreground-500">No filter selected</span>;
    }
    return (
      <div className="flex gap-2">
        {!!selectedMemberYear && (
          <Chip variant="bordered" color={'success'}>
            <div className="flex items-center gap-2">
              {selectedMemberYear}
              <Icon icon="thumb-up" size={16} />
            </div>
          </Chip>
        )}
        {!!selectedNonMemberYear && (
          <Chip variant="bordered">
            <div className="flex items-center gap-2">
              {selectedNonMemberYear}
              <Icon icon="thumb-down" size={16} />
            </div>
          </Chip>
        )}
        {!!selectedEvent && <EventChip eventName={selectedEvent} />}
      </div>
    );
  }, [
    filterSpecified,
    selectedMemberYear,
    selectedNonMemberYear,
    selectedEvent,
  ]);

  return (
    <div className={clsx(className)}>
      <Button
        className="w-full justify-start"
        variant="light"
        size="sm"
        startContent={<Icon className="self-center" icon="filter" />}
        onPress={onOpen}
      >
        {title}
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Filter Option
              </DrawerHeader>
              <DrawerBody>
                <YearSelect
                  yearRange={[minYear, maxYear]}
                  year={memberYear}
                  label="Membership Year"
                  description="Show properties who are members in the specified year"
                />
                <YearSelect
                  yearRange={[minYear, maxYear]}
                  year={nonMemberYear}
                  label="Non-Membership Year"
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
    </div>
  );
};
