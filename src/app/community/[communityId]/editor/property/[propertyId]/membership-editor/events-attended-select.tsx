import { Select, SelectItem, SelectSection } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';

const supportedEvents = [
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
];

interface Props {
  className?: string;
}

export const EventsAttendedSelect: React.FC<Props> = ({ className }) => {
  //   const { register, formState } = useHookFormContext();
  //   const { errors } = formState;
  //   const { fields, remove } = fieldArrayMethods;

  //   return (
  //     <Select
  //       className={clsx(className, 'max-w-sm')}
  //       items={fields}
  //       label="Membership Year"
  //       labelPlacement="outside-left"
  //       placeholder="Select a membership year"
  //       onChange={handleSelectionChange}
  //     >
  //       {(entry) => (
  //         <SelectItem key={entry.year} textValue={entry.year.toString()}>
  //           {entry.year}
  //         </SelectItem>
  //       )}
  //     </Select>
  //   );
  return null;
};
