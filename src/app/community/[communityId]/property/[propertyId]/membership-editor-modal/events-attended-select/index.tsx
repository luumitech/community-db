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

  const eventAttendedListError =
    errors.membershipList?.[yearIdx]?.eventAttendedList?.message;
  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center gap-4">
        <Button
          className="text-primary"
          endContent={<Icon icon="add" />}
          variant="faded"
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
        <div className="mb-2 text-sm text-danger">{eventAttendedListError}</div>
      </div>
    );
  }, [eventAttendedListError, append, lastEventSelected, defaultTicket]);

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
