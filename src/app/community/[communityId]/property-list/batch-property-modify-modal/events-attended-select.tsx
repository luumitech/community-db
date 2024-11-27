import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import {
  Select,
  SelectItem,
  SelectProps,
  SelectSection,
} from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { Button } from '~/view/base/button';
import { DatePicker } from '~/view/base/date-picker';
import { EventSelect } from '~/view/base/event-select';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const EventsAttendedSelect: React.FC<Props> = ({ className }) => {
  const { selectEventSections, communityUi } = useAppContext();
  const { lastEventSelected } = communityUi;
  const { control, register, formState, setValue, clearErrors } =
    useHookFormContext();
  const { errors } = formState;
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'membership.eventAttendedList',
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
            })
          }
        >
          Add Event
        </Button>
      </div>
    );
  }, [append, lastEventSelected]);

  const eventAttendedListError = errors.membership?.eventAttendedList?.message;
  const bottomContent = React.useMemo(() => {
    return (
      <div>
        <div
          className="mb-2 text-sm text-danger"
          {...register('membership.eventAttendedList')}
        >
          {eventAttendedListError}
        </div>
      </div>
    );
  }, [register, eventAttendedListError]);

  React.useEffect(() => {
    /** Set isMember flag if at least one event has been registered */
    setValue(`membership.isMember`, fields.length !== 0);
  }, [setValue, fields]);

  const onSelectionChange: NonNullable<SelectProps['onSelectionChange']> =
    React.useCallback(
      (keys) => {
        clearErrors(`membership.eventAttendedList`);
      },
      [clearErrors]
    );

  const renderRows = React.useCallback(() => {
    return fields.map((field, idx) => (
      <TableRow key={field.id}>
        <TableCell>
          <Select
            className={'max-w-sm'}
            aria-label="Event Name"
            items={selectEventSections}
            variant="underlined"
            placeholder="Select an event"
            errorMessage={
              errors.membership?.eventAttendedList?.[idx]?.eventName?.message
            }
            isInvalid={
              !!errors.membership?.eventAttendedList?.[idx]?.eventName?.message
            }
            onSelectionChange={onSelectionChange}
            {...register(`membership.eventAttendedList.${idx}.eventName`)}
          >
            {(section) => (
              <SelectSection
                key={section.title}
                title={section.title}
                items={section.items}
                showDivider={section.showDivider}
              >
                {(item) => (
                  <SelectItem key={item.value} textValue={item.label}>
                    {item.label}
                  </SelectItem>
                )}
              </SelectSection>
            )}
          </Select>
        </TableCell>
        <TableCell>
          <DatePicker
            className={'max-w-sm'}
            aria-label="Event Date"
            variant="underlined"
            granularity="day"
            name={`membership.eventAttendedList.${idx}.eventDate`}
            errorMessage={
              errors.membership?.eventAttendedList?.[idx]?.eventDate?.message
            }
            isInvalid={
              !!errors.membership?.eventAttendedList?.[idx]?.eventDate?.message
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
    errors.membership,
    fields,
    onSelectionChange,
    register,
    remove,
    selectEventSections,
  ]);

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
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody emptyContent={emptyContent}>{renderRows()}</TableBody>
      </Table>
    </div>
  );
};
