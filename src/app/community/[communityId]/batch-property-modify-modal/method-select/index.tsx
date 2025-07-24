import { cn } from '@heroui/react';
import React from 'react';
import { BatchModifyMethodSelect } from './batch-modify-method-select';
import { useCheckMethodRequirement } from './check-method-requirement';

interface Props {
  className?: string;
  forceCloseModal: () => void;
}

export const MethodSelect: React.FC<Props> = ({
  className,
  forceCloseModal,
}) => {
  const msg = useCheckMethodRequirement(forceCloseModal);

  return (
    <div className={cn(className, 'flex flex-col gap-4')}>
      <p>
        To modify a group of properties, start by selecting the type of changes
        you want to make:
      </p>
      <BatchModifyMethodSelect className="ml-4" />
      {msg}
    </div>
  );
};
