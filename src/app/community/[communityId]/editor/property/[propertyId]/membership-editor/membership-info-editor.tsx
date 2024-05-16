import { Card, CardBody, CardHeader, Checkbox, Input } from '@nextui-org/react';
import { Select, SelectItem, SelectSection } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useFieldArray, useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const MembershipInfoEditor: React.FC<Props> = ({ className }) => {
  const [selectedYear, setSelectedYear] = React.useState<number>();
  const { control, register, formState } = useHookFormContext();
  const { errors } = formState;
  const membershipMethods = useFieldArray({
    control,
    name: 'membershipList',
  });
  const { fields, remove } = membershipMethods;

  const handleSelectionChange: React.ChangeEventHandler<HTMLSelectElement> = (
    evt
  ) => {
    setSelectedYear(parseInt(evt.target.value, 10));
  };

  const idx = fields.findIndex((entry) => entry.year === selectedYear);

  return (
    <div className={clsx(className)}>
      <Card>
        <CardHeader>
          <Select
            className="max-w-sm"
            items={fields}
            label="Membership Year"
            labelPlacement="outside-left"
            placeholder="Select a membership year"
            onChange={handleSelectionChange}
          >
            {(entry) => (
              <SelectItem key={entry.year} textValue={entry.year.toString()}>
                {entry.year}
              </SelectItem>
            )}
          </Select>
        </CardHeader>
        {idx > -1 && (
          <CardBody key={selectedYear}>
            {/* <Input
              label="Year"
              errorMessage={errors.membershipList?.[idx]?.year?.message}
              isInvalid={!!errors.membershipList?.[idx]?.year?.message}
              {...register(`membershipList.${idx}.year`)}
            /> */}
            <Checkbox size="md" {...register(`membershipList.${idx}.isMember`)}>
              Is Member?
            </Checkbox>
          </CardBody>
        )}
      </Card>
    </div>
  );
};
