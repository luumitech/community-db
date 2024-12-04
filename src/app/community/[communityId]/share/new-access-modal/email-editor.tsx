import React from 'react';
import { Input } from '~/view/base/input';

interface Props {
  className?: string;
}

export const EmailEditor: React.FC<Props> = ({ className }) => {
  return (
    <Input
      className={className}
      controlName="email"
      label="Email"
      placeholder="Enter email"
    />
  );
};
