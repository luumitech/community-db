import { Accordion, AccordionItem, Button, Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
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
  const { minYear, maxYear } = useAppContext();
  const { year, event } = useFilterBarContext();

  const [selectedYear] = year;
  const [selectedEvent] = event;

  const filterSpecified = React.useMemo(() => {
    return !!selectedYear || !!selectedEvent;
  }, [selectedYear, selectedEvent]);

  const title = React.useMemo(() => {
    if (!filterSpecified) {
      return <span>No filter selected</span>;
    }
    return (
      <div className="flex gap-2">
        {!!selectedYear && (
          <Chip variant="bordered" color={'success'}>
            {selectedYear}
          </Chip>
        )}
        {!!selectedEvent && (
          <Chip variant="bordered" radius="sm" color={'primary'}>
            {selectedEvent}
          </Chip>
        )}
      </div>
    );
  }, [filterSpecified, selectedYear, selectedEvent]);

  return (
    <Accordion variant="light">
      <AccordionItem
        classNames={{
          base: clsx(className),
          title: 'text-sm text-default-500',
        }}
        aria-label="advance filter"
        isCompact
        startContent={<Icon className="self-center" icon="filter" />}
        title={title}
      >
        <div className="flex gap-2">
          <YearSelect
            className="w-[180px]"
            yearRange={[minYear, maxYear]}
            year={year}
          />
          <EventSelect className="w-[180px]" event={event} />
          <Button
            className="h-auto"
            variant="flat"
            isIconOnly
            isDisabled={!filterSpecified}
            onClick={() => {
              year.clear();
              event.clear();
            }}
          >
            <Icon icon="clear" />
          </Button>
        </div>
      </AccordionItem>
    </Accordion>
  );
};
