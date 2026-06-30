import React from 'react';
import { createInput } from '~/view/base/input';
import { type InputData } from './use-hook-form';

const Input = createInput<InputData>();

interface Props {
  className?: string;
}

export const EmailEditor: React.FC<Props> = ({ className }) => {
  return <Input className={className} controlName="email" label="Email" />;
};
