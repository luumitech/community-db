import React from 'react';
import { twMerge } from 'tailwind-merge';
import { BatchModifyMethodSelect } from './batch-modify-method-select';
import { useCheckMethodRequirement } from './check-method-requirement';

interface Props {
  className?: string;
}

export const MethodSelect: React.FC<Props> = ({ className }) => {
  const msg = useCheckMethodRequirement();

  return (
    <div className={twMerge('flex flex-col gap-4', className)}>
      <p>
        To modify a group of properties, start by selecting the type of changes
        you want to make:
      </p>
      <BatchModifyMethodSelect className="ml-4" />
      {msg}
    </div>
  );
};
