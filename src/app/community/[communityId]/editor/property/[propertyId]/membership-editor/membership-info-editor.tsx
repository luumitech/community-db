import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { EventsAttendedSelect } from './events-attended-select';
import { PaymentInfoEditor } from './payment-info-editor';
import { membershipDefault, useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const MembershipInfoEditor: React.FC<Props> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState<number>(currentYear);
  const { control } = useHookFormContext();
  const membershipMethods = useFieldArray({
    control,
    name: 'membershipList',
  });
  const { fields, prepend } = membershipMethods;

  const yearToAdd = React.useMemo(() => {
    return fields.length ? fields[0].year + 1 : currentYear;
  }, [currentYear, fields]);

  const prependYear = React.useCallback(() => {
    const newEntry = membershipDefault(yearToAdd);
    prepend(newEntry);
    setSelectedYear(yearToAdd);
  }, [yearToAdd, prepend]);

  const handleSelectionChange: React.ChangeEventHandler<HTMLSelectElement> = (
    evt
  ) => {
    if (evt.target.value === 'new-item') {
      prependYear();
    } else {
      setSelectedYear(parseInt(evt.target.value, 10));
    }
  };

  const idx = fields.findIndex((entry) => entry.year === selectedYear);

  return (
    <div className={clsx(className)}>
      <Card>
        <CardHeader>
          <Select
            className="max-w-sm"
            label="Membership Year"
            labelPlacement="outside-left"
            placeholder="Select a year to view in detail"
            selectedKeys={[selectedYear.toString()]}
            selectionMode="single"
            onChange={handleSelectionChange}
          >
            {[
              <SelectItem key="new-item">Add Year {yearToAdd}</SelectItem>,
              ...fields.map((entry) => (
                <SelectItem
                  key={entry.year.toString()}
                  textValue={entry.year.toString()}
                >
                  {entry.year}
                </SelectItem>
              )),
            ]}
          </Select>
        </CardHeader>
        {idx > -1 && (
          <CardBody key={selectedYear}>
            <PaymentInfoEditor className="pb-4" yearIdx={idx} />
            <EventsAttendedSelect yearIdx={idx} />
          </CardBody>
        )}
      </Card>
    </div>
  );
};
