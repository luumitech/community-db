import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  useHookFormContext,
  type TicketField,
  type TicketListFieldArray,
} from '../use-hook-form';
import { TicketRow, TicketRowHeader } from './ticket-row';

type RowEntry = TicketField & { key: string };

interface Props {
  className?: string;
  ticketListMethods: TicketListFieldArray;
  yearIdx: number;
  eventIdx: number;
}

export const TicketTable: React.FC<Props> = ({
  className,
  ticketListMethods,
  yearIdx,
  eventIdx,
}) => {
  const { formState } = useHookFormContext();
  const { errors } = formState;
  const { fields } = ticketListMethods;
  const ticketListError =
    errors.membershipList?.[yearIdx]?.eventAttendedList?.[eventIdx]?.ticketList
      ?.message;

  const rows: RowEntry[] = React.useMemo(() => {
    return fields.map((field) => ({
      key: field.id,
      ...field,
    }));
  }, [fields]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-danger">{ticketListError}</div>
      </div>
    );
  }, [ticketListError]);

  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      <div className="grid grid-cols-[repeat(4,1fr)_75px] gap-2 p-1">
        <TicketRowHeader />
        {rows.map((row, ticketIdx) => (
          <TicketRow
            key={row.key}
            ticketListMethods={ticketListMethods}
            yearIdx={yearIdx}
            eventIdx={eventIdx}
            ticketIdx={ticketIdx}
          />
        ))}
      </div>
      {bottomContent}
    </div>
  );
};
