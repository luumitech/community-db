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
        'bg-blue rounded-md'
      )}
    >
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="mt-2 text-xs text-foreground/70">{label}</div>
    </div>
  );
};
