import { cn } from '@heroui/react';
import React from 'react';

interface Props {
  title: string;
  color: string;
}

export const ChartWidget: React.FC<Props> = ({ title, color }) => {
  return (
    <div
      className={cn('flex h-full flex-col gap-2', 'rounded-medium p-4')}
      style={{
        background: color,
      }}
    >
      <span className="text-md font-bold">{title}</span>
      <div
        className={cn(
          'flex flex-1 items-center justify-center',
          'rounded-2xl',
          'bg-background/35 text-default-500'
        )}
      >
        Chart area
      </div>
    </div>
  );
};
