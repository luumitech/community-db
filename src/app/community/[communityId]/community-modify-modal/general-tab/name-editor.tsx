import React from 'react';
import { Input } from '~/view/base/input';

interface Props {
  className?: string;
}

export const NameEditor: React.FC<Props> = ({ className }) => {
  return (
    <Input
      className={className}
      controlName="name"
      variant="bordered"
      label="Name"
      placeholder="Enter community name"
    />
  );
};
