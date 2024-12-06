import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { EventSelect } from '~/view/base/event-select';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from '../use-hook-form';
import { EventDatePicker } from './event-date-picker';
import { EventNameSelect } from './event-name-select';
import { TicketInput } from './ticket-input';

interface Props {
  className?: string;
  yearIdx: number;
}

export const EventsAttendedSelect: React.FC<Props> = ({
  className,
  yearIdx,
}) => {
  const { communityUi } = useAppContext();
  const { lastEventSelected, defaultTicket } = communityUi;
  const { control, formState } = useHookFormContext();
  const { errors } = formState;
  const { fields, remove, append } = useFieldArray({
    control,
    name: `membershipList.${yearIdx}.eventAttendedList`,
  });

  const emptyContent = React.useMemo(() => {
    return <p>No data to display.</p>;
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex items-center gap-4">
        <EventSelect />
        <Button
          className="text-primary"
          endContent={<Icon icon="add" />}
          variant="faded"
          isDisabled={!lastEventSelected}
          onClick={() =>
            append({
              eventName: lastEventSelected ?? '',
              eventDate: new Date(Date.now()).toISOString(),
              ticket: defaultTicket ?? 0,
            })
          }
        >
          Add Event
        </Button>
      </div>
    );
  }, [append, lastEventSelected, defaultTicket]);

  const eventAttendedListError =
    errors.membershipList?.[yearIdx]?.eventAttendedList?.message;
  const bottomContent = React.useMemo(() => {
    return (
      <div className="mb-2 text-sm text-danger">{eventAttendedListError}</div>
    );
  }, [eventAttendedListError]);

  const renderRows = React.useCallback(() => {
    return fields.map((field, idx) => (
      <TableRow key={field.id}>
        <TableCell>
          <EventNameSelect
            className="max-w-sm"
            yearIdx={yearIdx}
            eventIdx={idx}
          />
        </TableCell>
        <TableCell>
          <EventDatePicker
            className="max-w-sm"
            yearIdx={yearIdx}
            eventIdx={idx}
          />
        </TableCell>
        <TableCell>
          <TicketInput className="max-w-sm" yearIdx={yearIdx} eventIdx={idx} />
        </TableCell>
        <TableCell>
          <FlatButton
            className="text-danger"
            icon="trash"
            tooltip="Remove Event"
            onClick={() => remove(idx)}
          />
        </TableCell>
      </TableRow>
    ));
  }, [fields, remove, yearIdx]);

  return (
    <div className={clsx(className)}>
      <Table
        aria-label="Membership year editor"
        removeWrapper
        classNames={{
          // Leave enough space for one row of data only
          emptyWrapper: 'h-[40px]',
        }}
        topContent={topContent}
        bottomContent={bottomContent}
      >
        <TableHeader>
          <TableColumn>Event Attended</TableColumn>
          <TableColumn>Event Date</TableColumn>
          <TableColumn>Ticket</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody emptyContent={emptyContent}>{renderRows()}</TableBody>
      </Table>
    </div>
  );
};
