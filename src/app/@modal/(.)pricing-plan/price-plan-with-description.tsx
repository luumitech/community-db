import { cn } from '@heroui/react';
import React from 'react';
import { PricePlan } from './price-plan';

interface Props {
  className?: string;
  planName: React.ReactNode;
  planCost: string;
  maxCommunity?: string;
  maxProperty?: string;
  button?: React.ReactNode;
}

export const PricePlanWithDescription: React.FC<
  React.PropsWithChildren<Props>
> = ({
  className,
  planName,
  planCost,
  maxCommunity,
  maxProperty,
  button,
  children,
}) => {
  return (
    <article
      className={cn(
        className,
        'grid grid-rows-subgrid row-span-4 gap-4',
        // This is necessary to allow parent divider to render correctly
        '[&:not(:last-child)]:pr-6',
        '[&:not(:first-child)]:pl-6'
      )}
    >
      <PricePlan planName={planName} planCost={planCost} />
      {button}
      <ul className="list-disc pl-4">
        <li>
          {maxCommunity == null
            ? 'Unlimited communities'
            : maxCommunity === '1'
              ? '1 community'
              : `Up to ${maxCommunity} communities`}
        </li>
        <li>
          {maxProperty == null
            ? 'Unlimited addresses per community'
            : `Up to ${maxProperty} addresses per community`}
        </li>
      </ul>
      {children}
    </article>
  );
};
