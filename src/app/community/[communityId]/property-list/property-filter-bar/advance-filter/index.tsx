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
import { useAppContext } from '~/custom-hooks/app-context';
import { Icon } from '~/view/base/icon';
import { type CommunityEntry } from '../../_type';
import { useFilterBarContext } from '../context';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
  community?: CommunityEntry;
}

export const AdvanceFilter: React.FC<Props> = ({ className, community }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { minYear, maxYear } = useAppContext();
  const { year, event } = useFilterBarContext();

  const [selectedYear] = year;
  const [selectedEvent] = event;

  const filterSpecified = React.useMemo(() => {
    return !!selectedYear || !!selectedEvent;
  }, [selectedYear, selectedEvent]);

  const title = React.useMemo(() => {
    if (!filterSpecified) {
      return <span className="text-foreground-500">No filter selected</span>;
    }
    return (
      <div className="flex gap-2">
        {!!selectedYear && (
          <Chip variant="bordered" color={'success'}>
            {selectedYear}
          </Chip>
        )}
        {!!selectedEvent && <EventChip eventName={selectedEvent} />}
      </div>
    );
  }, [filterSpecified, selectedYear, selectedEvent]);

  return (
    <div className={clsx(className)}>
      <Button
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
                  className="w-[180px]"
                  yearRange={[minYear, maxYear]}
                  year={year}
                />
                <EventSelect className="w-[180px]" event={event} />
              </DrawerBody>
              <DrawerFooter>
                <Button
                  className="h-auto"
                  variant="flat"
                  isDisabled={!filterSpecified}
                  onPress={() => {
                    year.clear();
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
