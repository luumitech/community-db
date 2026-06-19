import React from 'react';
import * as GQL from '~/graphql/generated/types';
import {
  createSelect,
  type SelectItem,
  type SelectProps,
} from '~/view/base/select';
import { type InputData } from '../../use-hook-form';

const Select = createSelect<InputData>();

export const contactMethodItems: SelectItem[] = [
  {
    key: GQL.ContactInfoType.Email,
    textValue: 'Email',
  },
  {
    key: GQL.ContactInfoType.Phone,
    textValue: 'Phone',
  },
  {
    key: GQL.ContactInfoType.Other,
    textValue: 'Other',
  },
];

type CustomProps = Omit<SelectProps, 'items'>;

interface Props extends CustomProps {
  className?: string;
  controlName: `occupancyInfoList.${number}.occupantList.${number}.infoList.${number}.type`;
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
    />
  );
};
