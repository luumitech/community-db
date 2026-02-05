import { cn } from '@heroui/react';
import React from 'react';
import { Input } from '~/view/base/input';

interface Props {
  className?: string;
}

export const FullNameEditor: React.FC<Props> = ({ className }) => {
  return (
    <>
      <Input
        className={className}
        controlName="merge_fields.FNAME"
        label="First Name"
      />
      <Input
        className={className}
        controlName="merge_fields.LNAME"
        label="Last Name"
      />
    </>
  );
};
