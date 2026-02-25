import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem, SelectProps } from '~/view/base/select';

interface ContactTypeItem {
  /** Label to appear in selection list */
  label: string;
  /** Value corresponding to the selection item */
  value: GQL.ContactInfoType;
}

export const contactTypeItems: ContactTypeItem[] = [
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

type CustomProps = Omit<SelectProps<ContactTypeItem>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const ContactTypeSelect: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Select
      classNames={{
        base: className,
      }}
      items={contactTypeItems}
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
