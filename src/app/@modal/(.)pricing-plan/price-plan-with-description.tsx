import React from 'react';
import { twMerge } from 'tailwind-merge';
import { PricePlan } from './price-plan';

interface Props {
  className?: string;
  planName: React.ReactNode;
  planCost: number;
  maxCommunity: number | null;
  maxProperty: number | null;
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
      className={twMerge(
        'row-span-4 grid grid-rows-subgrid gap-4',
        // This is necessary to allow parent divider to render correctly
        'not-last:pr-6',
        'not-first:pl-6',
        className
      )}
    >
      <PricePlan planName={planName} planCost={planCost} />
      {button}
      <ul className="list-disc pl-4">
        <li>
          {maxCommunity == null
            ? 'Unlimited communities'
            : maxCommunity === 1
              ? '1 community'
              : `Up to ${maxCommunity} communities`}
        </li>
        <li>
          {maxProperty == null
            ? 'Unlimited addresses per community'
            : maxProperty === 1
              ? '1 address'
              : `Up to ${maxProperty} addresses per community`}
        </li>
      </ul>
      {children}
    </article>
  );
};
