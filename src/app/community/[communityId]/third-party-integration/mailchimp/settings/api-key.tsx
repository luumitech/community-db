import React from 'react';
import { createInput } from '~/view/base/input';
import { type InputData } from './use-hook-form';

const Input = createInput<InputData>();

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
