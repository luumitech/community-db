import { cn } from '@heroui/react';
import React from 'react';

interface Props {
  label: string;
  value: string;
}

export const StatWidget: React.FC<Props> = ({ label, value }) => {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center',
        'rounded-md bg-blue-200'
      )}
    >
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="mt-2 text-xs text-default-500">{label}</div>
    </div>
  );
};
