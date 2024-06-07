import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Select, SelectItem, SelectProps } from '@nextui-org/select';
import { type RowElement, type RowProps } from '@react-types/table';
import clsx from 'clsx';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import { DatePicker } from '~/view/base/date-picker';
import { FlatButton } from '~/view/base/flat-button';
import { useContext } from '../context';
import { EventDefaultSelect } from './event-default-select';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  yearIdx: number;
}

export const EventsAttendedSelect: React.FC<Props> = ({
  className,
  yearIdx,
}) => {
  const { supportedEvents } = useContext();
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
      </div>
    );
  }, [register, yearIdx, eventAttendedListError]);

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

  const renderRows = React.useCallback(() => {
    return fields.map((field, idx) => (
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
    ));
  }, [
    errors.membershipList,
    fields,
    onSelectionChange,
    register,
    remove,
    yearIdx,
    supportedEvents,
  ]);

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
          {/* Cannot resolve strange typescript error */}
          {renderRows() as unknown as RowElement<unknown>}
          <TableRow>
            <TableCell colSpan={2}>
              <EventDefaultSelect />
            </TableCell>
            {/* This hidden cell is needed to workaround an error
             * https://github.com/nextui-org/nextui/issues/1779
             */}
            <TableCell className="hidden">{null}</TableCell>
            <TableCell>
              <FlatButton
                className="text-primary"
                icon="add"
                tooltip="Add Event"
                onClick={() =>
                  append({
                    eventName: lastEventSelected ?? '',
                    eventDate: new Date(Date.now()).toISOString(),
                  })
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
