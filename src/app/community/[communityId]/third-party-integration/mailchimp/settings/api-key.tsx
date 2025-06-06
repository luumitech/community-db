import { cn } from '@heroui/react';
import React from 'react';
import { Input } from '~/view/base/input';

interface Props {
  className?: string;
}

export const ApiKey: React.FC<Props> = ({ className }) => {
  return (
    <Input
      controlName="mailchimpSetting.apiKey"
      variant="bordered"
      label="API key"
      isClearable
    />
  );
};
