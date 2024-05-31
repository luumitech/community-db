import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Select, SelectItem, SelectProps } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import { DatePicker } from '~/view/base/date-picker';
import { FlatButton } from '~/view/base/flat-button';
import { EventDefaultSelect } from './event-default-select';
import { useHookFormContext } from './use-hook-form';

export const supportedEvents = [
  'Membership Form',
  'AGM',
  'Spring Garage Sale',
  'Summer Festival',
  'Corn Roast',
  'Fall Garage Sale',
  'Membership Drive',
  'Membership Carry Forward',
  'Legacy Issue',
  'Other',
].map((entry) => ({ label: entry, value: entry }));

interface Props {
  className?: string;
  yearIdx: number;
}

export const EventsAttendedSelect: React.FC<Props> = ({
  className,
  yearIdx,
}) => {
  const lastEventSelected = useSelector((state) => state.ui.lastEventSelected);
  const { control, register, formState, setValue, clearErrors } =
    useHookFormContext();
  const { errors } = formState;
  const { fields, remove, append } = useFieldArray({
    control,
    name: `membershipList.${yearIdx}.eventAttendedList`,
  });

  const eventAttendedListError =
    errors.membershipList?.[yearIdx]?.eventAttendedList?.message;
  const bottomContent = React.useMemo(() => {
    return (
      <div>
        <div
          className="mb-2 text-sm text-danger"
          {...register(`membershipList.${yearIdx}.eventAttendedList`)}
        >
          {eventAttendedListError}
        </div>
        <div className="flex w-full items-center gap-2">
          <EventDefaultSelect />
          <Button
            endContent={<IoMdAddCircleOutline />}
            onClick={() =>
              append({
                eventName: lastEventSelected ?? '',
                eventDate: new Date(Date.now()).toISOString(),
              })
            }
          >
            Add event
          </Button>
        </div>
      </div>
    );
  }, [register, yearIdx, eventAttendedListError, lastEventSelected, append]);

  React.useEffect(() => {
    /**
     * Set isMember flag if at least one event has been registered
     */
    setValue(`membershipList.${yearIdx}.isMember`, fields.length !== 0);
  }, [setValue, fields, yearIdx]);

  const onSelectionChange: NonNullable<SelectProps['onSelectionChange']> =
    React.useCallback(
      (keys) => {
        clearErrors(`membershipList.${yearIdx}.eventAttendedList`);
      },
      [clearErrors, yearIdx]
    );

  return (
    <div className={clsx(className)}>
      <Table
        aria-label="Membership year editor"
        removeWrapper
        bottomContent={bottomContent}
      >
        <TableHeader>
          <TableColumn>Event</TableColumn>
          <TableColumn>Event Date</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {fields.map((field, idx) => (
            <TableRow key={field.id}>
              <TableCell>
                <Select
                  className={'max-w-sm'}
                  aria-label="Event Name"
                  items={supportedEvents}
                  variant="underlined"
                  placeholder="Select an event"
                  errorMessage={
                    errors.membershipList?.[yearIdx]?.eventAttendedList?.[idx]
                      ?.eventName?.message
                  }
                  isInvalid={
                    !!errors.membershipList?.[yearIdx]?.eventAttendedList?.[idx]
                      ?.eventName?.message
                  }
                  onSelectionChange={onSelectionChange}
                  {...register(
                    `membershipList.${yearIdx}.eventAttendedList.${idx}.eventName`
                  )}
                >
                  {(entry) => (
                    <SelectItem key={entry.value} textValue={entry.label}>
                      {entry.label}
                    </SelectItem>
                  )}
                </Select>
              </TableCell>
              <TableCell>
                <DatePicker
                  className={'max-w-sm'}
                  aria-label="Event Date"
                  variant="underlined"
                  granularity="day"
                  name={`membershipList.${yearIdx}.eventAttendedList.${idx}.eventDate`}
                  errorMessage={
                    errors.membershipList?.[yearIdx]?.eventAttendedList?.[idx]
                      ?.eventDate?.message
                  }
                  isInvalid={
                    !!errors.membershipList?.[yearIdx]?.eventAttendedList?.[idx]
                      ?.eventDate?.message
                  }
                />
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
