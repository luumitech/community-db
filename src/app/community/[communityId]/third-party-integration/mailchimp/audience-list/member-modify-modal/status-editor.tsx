import React from 'react';
import { StatusSelect } from '../status-select';

interface Props {
  className?: string;
}

export const StatusEditor: React.FC<Props> = ({ className }) => {
  return (
    <StatusSelect
      controlName="status"
      label="Subscriber Status"
      selectionMode="single"
      disallowEmptySelection
    />
  );
};
