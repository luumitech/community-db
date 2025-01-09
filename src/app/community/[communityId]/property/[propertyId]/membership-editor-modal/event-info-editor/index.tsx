import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  type SlotsToClasses,
  type TableSlots,
} from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFieldArray } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { insertIf } from '~/lib/insert-if';
import { Button } from '~/view/base/button';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import {
  useHookFormContext,
  type MembershipListFieldArray,
} from '../use-hook-form';
import { EventDatePicker } from './event-date-picker';
import { EventNameSelect } from './event-name-select';
import { PaymentSelect } from './payment-select';
import { PriceInput } from './price-input';
import { TicketInput } from './ticket-input';

type MembershipField = MembershipListFieldArray['fields'][0];
type RowEntry = MembershipField['eventAttendedList'][0] & {
  key: string;
  type: 'eventInfo' | 'ticket';
  eventIdx: number;
};

interface Props {
  className?: SlotsToClasses<TableSlots>;
  membershipField: MembershipField;
  yearIdx: number;
}

export const EventInfoEditor: React.FC<Props> = ({
  className,
  membershipField,
  yearIdx,
}) => {
  const { communityUi } = useAppContext();
  const { lastEventSelected, defaultTicket } = communityUi;
  const { control, formState } = useHookFormContext();
  const { errors } = formState;
  const eventAttendedListMethods = useFieldArray({
    control,
    name: `membershipList.${yearIdx}.eventAttendedList`,
  });
  const { fields, append, remove } = eventAttendedListMethods;
  const eventAttendedListError =
    errors.membershipList?.[yearIdx]?.eventAttendedList?.message;

  const rows: RowEntry[] = React.useMemo(() => {
    return fields.map((field, idx) => ({
      key: `${membershipField.id}-${field.id}`,
      type: 'eventInfo',
      eventIdx: idx,
      ...field,
    }));
  }, [membershipField, fields]);

  const columns = React.useMemo(() => {
    return [
      { key: 'eventName', label: 'Event', className: 'w-[160px]' },
      { key: 'eventDate', label: 'Event Date', className: 'w-[160px]' },
      { key: 'ticketType', label: 'Ticket Type', className: 'w-[100px]' },
      { key: 'ticket', label: 'Ticket #', className: 'w-[60px]' },
      { key: 'price', label: 'Price', className: 'w-[100px]' },
      { key: 'paymentMethod', label: 'Payment Method', className: 'w-[160px]' },
      { key: 'action', label: '', className: '' },
    ];
  }, []);

  const renderCell = React.useCallback(
    (entry: RowEntry, columnKey: string | number) => {
      if (entry.type === 'eventInfo') {
        switch (columnKey) {
          case 'eventName':
            return (
              <EventNameSelect
                // className="max-w-sm"
                yearIdx={yearIdx}
                eventIdx={entry.eventIdx}
              />
            );
          case 'eventDate':
            return (
              <EventDatePicker
                // className="max-w-[120px]"
                yearIdx={yearIdx}
                eventIdx={entry.eventIdx}
              />
            );

          case 'price':
            if (entry.eventIdx > 0) {
              break;
            }
            return (
              <PriceInput
                yearIdx={yearIdx}
                // eventIdx={entry.eventIdx}
              />
            );
          case 'paymentMethod':
            if (entry.eventIdx > 0) {
              break;
            }
            return (
              <PaymentSelect
                className="max-w-sm"
                yearIdx={yearIdx}
                // eventIdx={entry.eventIdx}
              />
            );
          case 'action':
            return (
              <FlatButton
                className="text-danger"
                icon="trash"
                tooltip="Remove Event"
                onClick={() => remove(entry.eventIdx)}
              />
            );
          default:
            return null;
        }
      } else if (entry.type === 'ticket') {
        switch (columnKey) {
          case 'ticket':
            return <TicketInput yearIdx={yearIdx} eventIdx={entry.eventIdx} />;
          default:
            return null;
        }
      }
      return null;
    },
    [yearIdx, remove]
  );

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center gap-4">
        <Button
          className="text-primary"
          endContent={<Icon icon="add" />}
          variant="faded"
          onPress={() =>
            append({
              eventName: lastEventSelected ?? '',
              eventDate: new Date(Date.now()).toISOString(),
              ticket: defaultTicket ?? 0,
            })
          }
        >
          Add Event
        </Button>
        <div className="text-sm text-danger">{eventAttendedListError}</div>
      </div>
    );
  }, [eventAttendedListError, append, lastEventSelected, defaultTicket]);

  return (
    <Table
      classNames={{
        // Leave enough space for one row of data only
        emptyWrapper: 'h-[40px]',
        ...className,
      }}
      aria-label="Event Info Editor"
      removeWrapper
      bottomContent={bottomContent}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} className={column.className}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
