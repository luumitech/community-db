import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { createSelect, SelectItem, SelectProps } from '~/view/base/select';
import { type InputData } from '../../use-hook-form';

const Select = createSelect<InputData>();

interface ContactMethodItem {
  /** Label to appear in selection list */
  label: string;
  /** Value corresponding to the selection item */
  value: GQL.ContactInfoType;
}

export const contactMethodItems: ContactMethodItem[] = [
  {
    label: 'Email',
    value: GQL.ContactInfoType.Email,
  },
  {
    label: 'Phone',
    value: GQL.ContactInfoType.Phone,
  },
  {
    label: 'Other',
    value: GQL.ContactInfoType.Other,
  },
];

type CustomProps = Omit<SelectProps<ContactMethodItem, InputData>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const ContactMethodSelect: React.FC<Props> = ({
  className,
  ...props
}) => {
  return (
    <Select
      classNames={{
        base: className,
      }}
      items={contactMethodItems}
      selectionMode="single"
      disallowEmptySelection
      {...props}
    >
      {(item) => {
        return (
          <SelectItem key={item.value.toString()} textValue={item.label}>
            <div>{item.label}</div>
          </SelectItem>
        );
      }}
    </Select>
  );
};
