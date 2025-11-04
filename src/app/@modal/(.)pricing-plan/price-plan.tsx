import { Spacer, cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
  planName: React.ReactNode;
  planCost: string;
}

export const PricePlan: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  planName,
  planCost,
}) => {
  return (
    <div>
      <div className="text-xl font-bold">{planName}</div>
      <div className="flex items-end">
        <span className="self-start text-xl text-foreground-500">$</span>
        <span className="text-5xl">{planCost}</span>
        <Spacer y={1} />
        <span className="mb-1 text-xs leading-[0.9rem] text-foreground-500">
          <p>CAD/</p>
          <p>month</p>
        </span>
      </div>
    </div>
  );
};
