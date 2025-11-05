import React from 'react';
import { Input } from '~/view/base/input';

interface Props {
  className?: string;
}

export const ApiKey: React.FC<Props> = ({ className }) => {
  return (
    <Input
      controlName="geoapifySetting.apiKey"
      variant="bordered"
      label="API key"
      isClearable
    />
  );
};
