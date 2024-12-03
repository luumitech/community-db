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
import { DatePicker } from '~/view/base/date-picker';
import { EventSelect } from '~/view/base/event-select';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import {
  Select,
  SelectItem,
  SelectProps,
  SelectSection,
} from '~/view/base/select';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  yearIdx: number;
}

export const EventsAttendedSelect: React.FC<Props> = ({
  className,
  yearIdx,
}) => {
  const { selectEventSections, communityUi } = useAppContext();
  const { lastEventSelected } = communityUi;
  const { control, register, formState, setValue, clearErrors } =
    useHookFormContext();
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
            })
          }
        >
          Add Event
        </Button>
      </div>
    );
  }, [append, lastEventSelected]);

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
            className="max-w-sm"
            controlName={`membershipList.${yearIdx}.eventAttendedList.${idx}.eventName`}
            aria-label="Event Name"
            items={selectEventSections}
            variant="underlined"
            placeholder="Select an event"
            onSelectionChange={onSelectionChange}
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
            className="max-w-sm"
            aria-label="Event Date"
            variant="underlined"
            granularity="day"
            controlName={`membershipList.${yearIdx}.eventAttendedList.${idx}.eventDate`}
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
  }, [fields, onSelectionChange, remove, yearIdx, selectEventSections]);

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
